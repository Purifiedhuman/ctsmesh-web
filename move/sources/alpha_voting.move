module alpha_voting_addr::alpha_voting {
    use std::signer;
    use aptos_framework::account;
    use std::string::{String, utf8};
    use aptos_std::table::{Self, Table};
    use std::vector;
    use aptos_framework::randomness;

    // Struct to hold the votes for an alpha or noise
    struct VoteInfo has store, drop {
        total_votes: u64,
        voters: vector<address>
    }

    // Struct to hold the votes for all alphas and noises
    struct Votes has key {
        alpha_votes: Table<String, VoteInfo>,
        noise_votes: Table<String, VoteInfo>
    }

    // Struct to hold an individual account's votes
    struct AccountVotes has key {
        alpha_votes: Table<String, u64>,
        noise_votes: Table<String, u64>
    }
    /// Struct to hold rewards for addresses
    struct RewardTable has key {
        rewards: Table<address, u64>
    }

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;

    // Initialize the Votes resource under the module account
    fun init_module(account: &signer) {
        move_to(account, Votes { 
            alpha_votes: table::new(),
            noise_votes: table::new()
        });
        move_to(account, RewardTable {
            rewards: table::new()
        });
    }
    #[randomness]
    #[lint::allow_unsafe_randomness]
    // Vote for a specific alpha, increasing its vote count and recording the voter
    public(friend) entry fun vote_alpha(account: &signer, tweet: String,reward_address: address) acquires Votes, AccountVotes,RewardTable{
        let account_addr = signer::address_of(account);
        
        // Initialize Votes if not exists
        if (!exists<Votes>(@alpha_voting_addr)) {
            move_to(account, Votes { 
                alpha_votes: table::new(),
                noise_votes: table::new()
            });
            move_to(account, RewardTable {
            rewards: table::new()
            });
        };
        
        // Initialize AccountVotes if not exists
        if (!exists<AccountVotes>(account_addr)) {
            move_to(account, AccountVotes { 
                alpha_votes: table::new(),
                noise_votes: table::new()
            });
        };
        
        // Update Votes
        let votes = borrow_global_mut<Votes>(@alpha_voting_addr);
        if (!table::contains(&votes.alpha_votes, tweet)) {
            table::add(&mut votes.alpha_votes, tweet, VoteInfo { total_votes: 0, voters: vector::empty() });
        };
        let vote_info = table::borrow_mut(&mut votes.alpha_votes, tweet);
        vote_info.total_votes = vote_info.total_votes + 1;
        if (!vector::contains(&vote_info.voters, &account_addr)) {
            vector::push_back(&mut vote_info.voters, account_addr);
        };
        
        // Update AccountVotes
        let account_votes = borrow_global_mut<AccountVotes>(account_addr);
        if (!table::contains(&account_votes.alpha_votes, tweet)) {
            table::add(&mut account_votes.alpha_votes, tweet, 0);
        };
        let vote_count = table::borrow_mut(&mut account_votes.alpha_votes, tweet);
        *vote_count = *vote_count + 1;

        // Compare votes and update reward
        let random_coin_value = randomness::u64_range(0, 100);
        let alpha_votes = vote_info.total_votes;
        let noise_votes = if (table::contains(&votes.noise_votes, tweet)) {
            table::borrow(&votes.noise_votes, tweet).total_votes
        } else {
            0
        };

        let reward_value = if (alpha_votes > noise_votes) {
            random_coin_value
        } else {
            0
        };

        update_reward(reward_address, reward_value);
    }

    #[randomness]
    #[lint::allow_unsafe_randomness]
    // Vote for a specific noise, increasing its vote count and recording the voter
    public(friend) entry fun vote_noise(account: &signer, tweet: String, reward_address: address) acquires Votes, AccountVotes, RewardTable {
        let account_addr = signer::address_of(account);
        
        // Initialize Votes if not exists
        if (!exists<Votes>(@alpha_voting_addr)) {
            move_to(account, Votes { 
                alpha_votes: table::new(),
                noise_votes: table::new()
            });
        };
        
        // Initialize AccountVotes if not exists
        if (!exists<AccountVotes>(account_addr)) {
            move_to(account, AccountVotes { 
                alpha_votes: table::new(),
                noise_votes: table::new()
            });
        };
        
        // Update Votes
        let votes = borrow_global_mut<Votes>(@alpha_voting_addr);
        if (!table::contains(&votes.noise_votes, tweet)) {
            table::add(&mut votes.noise_votes, tweet, VoteInfo { total_votes: 0, voters: vector::empty() });
        };
        let vote_info = table::borrow_mut(&mut votes.noise_votes, tweet);
        vote_info.total_votes = vote_info.total_votes + 1;
        if (!vector::contains(&vote_info.voters, &account_addr)) {
            vector::push_back(&mut vote_info.voters, account_addr);
        };
        
        // Update AccountVotes
        let account_votes = borrow_global_mut<AccountVotes>(account_addr);
        if (!table::contains(&account_votes.noise_votes, tweet)) {
            table::add(&mut account_votes.noise_votes, tweet, 0);
        };
        let vote_count = table::borrow_mut(&mut account_votes.noise_votes, tweet);
        *vote_count = *vote_count + 1;

        // Compare votes and update reward
        let random_coin_value = randomness::u64_range(0, 100);
        let noise_votes = vote_info.total_votes;
        let alpha_votes = if (table::contains(&votes.alpha_votes, tweet)) {
            table::borrow(&votes.alpha_votes, tweet).total_votes
        } else {
            0
        };

        let reward_value = if (noise_votes > alpha_votes) {
            random_coin_value
        } else {
            0
        };

        update_reward(reward_address, reward_value);
    }

    // Modify the update_reward function
    fun update_reward(reward_address: address, reward_value: u64) acquires RewardTable {
        if (!exists<RewardTable>(@alpha_voting_addr)) {
            // This should be called only once during module initialization
            abort 1 // or handle this case appropriately
        };

        let reward_table = borrow_global_mut<RewardTable>(@alpha_voting_addr);
        if (!table::contains(&reward_table.rewards, reward_address)) {
            table::add(&mut reward_table.rewards, reward_address, reward_value);
        } else {
            let current_reward = table::borrow_mut(&mut reward_table.rewards, reward_address);
            *current_reward = reward_value; // Directly set the new reward value, overwriting the previous value
        };
    }
    #[view]
    public fun view_reward(reward_address: address): u64 acquires RewardTable {
        if (!exists<RewardTable>(@alpha_voting_addr)) {
            return 0
        };

        let reward_table = borrow_global<RewardTable>(@alpha_voting_addr);
        if (table::contains(&reward_table.rewards, reward_address)) {
            *table::borrow(&reward_table.rewards, reward_address)
        } else {
            0
        }
    }
    // View all votes for a specific alpha
    #[view]
    public fun view_alpha_votes(tweet: String): (u64, vector<address>) acquires Votes {
        assert!(exists<Votes>(@alpha_voting_addr), E_NOT_INITIALIZED);
        let votes = borrow_global<Votes>(@alpha_voting_addr);
        
        if (table::contains(&votes.alpha_votes, tweet)) {
            let vote_info = table::borrow(&votes.alpha_votes, tweet);
            (vote_info.total_votes, *&vote_info.voters)
        } else {
            (0, vector::empty<address>()) // Return empty data if the alpha doesn't exist in the table
        }
    }

    // View all votes for a specific noise
    #[view]
    public fun view_noise_votes(tweet: String): (u64, vector<address>) acquires Votes {
        assert!(exists<Votes>(@alpha_voting_addr), E_NOT_INITIALIZED);
        let votes = borrow_global<Votes>(@alpha_voting_addr);
        
        if (table::contains(&votes.noise_votes, tweet)) {
            let vote_info = table::borrow(&votes.noise_votes, tweet);
            (vote_info.total_votes, *&vote_info.voters)
        } else {
            (0, vector::empty<address>()) // Return empty data if the noise doesn't exist in the table
        }
    }

    // View the votes that an account voted for a particular alpha
    #[view]
    public fun view_account_votes_for_alpha(account_addr: address, tweet: String): u64 acquires AccountVotes {
        if (!exists<AccountVotes>(account_addr)) {
            return 0
        };
        
        let account_votes = borrow_global<AccountVotes>(account_addr);
        if (table::contains(&account_votes.alpha_votes, tweet)) {
            *table::borrow(&account_votes.alpha_votes, tweet)
        } else {
            0
        }
    }

    // View the votes that an account voted for a particular noise
    #[view]
    public fun view_account_votes_for_noise(account_addr: address, tweet: String): u64 acquires AccountVotes {
        if (!exists<AccountVotes>(account_addr)) {
            return 0
        };
        
        let account_votes = borrow_global<AccountVotes>(account_addr);
        if (table::contains(&account_votes.noise_votes, tweet)) {
            *table::borrow(&account_votes.noise_votes, tweet)
        } else {
            0
        }
    }

    #[test(account = @0x1)]
    public entry fun test_voting_and_rewards(account: signer) acquires Votes, AccountVotes, RewardTable {
        let account_addr = signer::address_of(&account);
        
        // Vote for alpha and noise
        vote_alpha(&account, utf8(b"tweet1"), account_addr);
        vote_noise(&account, utf8(b"tweet1"), account_addr);
        vote_alpha(&account, utf8(b"tweet1"), account_addr);
        
        // Check votes
        let (alpha_votes, _) = view_alpha_votes(utf8(b"tweet1"));
        let (noise_votes, _) = view_noise_votes(utf8(b"tweet1"));
        assert!(alpha_votes == 2, 0);
        assert!(noise_votes == 1, 1);
        
        // Check reward
        let reward = view_reward(account_addr);
        assert!(reward > 0 && reward <= 200, 2); // Reward should be between 0 and 200 (two random values between 0 and 100)
    }
}