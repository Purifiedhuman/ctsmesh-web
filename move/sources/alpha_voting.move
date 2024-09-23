module alpha_voting_addr::alpha_voting {
    use std::signer;
    use aptos_framework::account;
    use std::string::{String, utf8};
    use aptos_std::table::{Self, Table};
    use std::vector;

    /// Struct to hold the votes for an alpha or beta
    struct VoteInfo has store, drop {
        total_votes: u64,
        voters: vector<address>
    }

    /// Struct to hold the votes for all alphas and betas
    struct Votes has key {
        alpha_votes: Table<String, VoteInfo>,
        beta_votes: Table<String, VoteInfo>
    }

    /// Struct to hold an individual account's votes
    struct AccountVotes has key {
        alpha_votes: Table<String, u64>,
        beta_votes: Table<String, u64>
    }

    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;

    /// Initialize the Votes resource under the module account
    fun init_module(account: &signer) {
        move_to(account, Votes { 
            alpha_votes: table::new(),
            beta_votes: table::new()
        });
    }

    /// Vote for a specific alpha, increasing its vote count and recording the voter
    public entry fun vote_alpha(account: &signer, alpha_name: String) acquires Votes, AccountVotes {
        let account_addr = signer::address_of(account);
        
        // Initialize Votes if not exists
        if (!exists<Votes>(@alpha_voting_addr)) {
            move_to(account, Votes { 
                alpha_votes: table::new(),
                beta_votes: table::new()
            });
        };
        
        // Initialize AccountVotes if not exists
        if (!exists<AccountVotes>(account_addr)) {
            move_to(account, AccountVotes { 
                alpha_votes: table::new(),
                beta_votes: table::new()
            });
        };
        
        // Update Votes
        let votes = borrow_global_mut<Votes>(@alpha_voting_addr);
        if (!table::contains(&votes.alpha_votes, alpha_name)) {
            table::add(&mut votes.alpha_votes, alpha_name, VoteInfo { total_votes: 0, voters: vector::empty() });
        };
        let vote_info = table::borrow_mut(&mut votes.alpha_votes, alpha_name);
        vote_info.total_votes = vote_info.total_votes + 1;
        if (!vector::contains(&vote_info.voters, &account_addr)) {
            vector::push_back(&mut vote_info.voters, account_addr);
        };
        
        // Update AccountVotes
        let account_votes = borrow_global_mut<AccountVotes>(account_addr);
        if (!table::contains(&account_votes.alpha_votes, alpha_name)) {
            table::add(&mut account_votes.alpha_votes, alpha_name, 0);
        };
        let vote_count = table::borrow_mut(&mut account_votes.alpha_votes, alpha_name);
        *vote_count = *vote_count + 1;
    }

    /// Vote for a specific beta, increasing its vote count and recording the voter
    public entry fun vote_beta(account: &signer, beta_name: String) acquires Votes, AccountVotes {
        let account_addr = signer::address_of(account);
        
        // Initialize Votes if not exists
        if (!exists<Votes>(@alpha_voting_addr)) {
            move_to(account, Votes { 
                alpha_votes: table::new(),
                beta_votes: table::new()
            });
        };
        
        // Initialize AccountVotes if not exists
        if (!exists<AccountVotes>(account_addr)) {
            move_to(account, AccountVotes { 
                alpha_votes: table::new(),
                beta_votes: table::new()
            });
        };
        
        // Update Votes
        let votes = borrow_global_mut<Votes>(@alpha_voting_addr);
        if (!table::contains(&votes.beta_votes, beta_name)) {
            table::add(&mut votes.beta_votes, beta_name, VoteInfo { total_votes: 0, voters: vector::empty() });
        };
        let vote_info = table::borrow_mut(&mut votes.beta_votes, beta_name);
        vote_info.total_votes = vote_info.total_votes + 1;
        if (!vector::contains(&vote_info.voters, &account_addr)) {
            vector::push_back(&mut vote_info.voters, account_addr);
        };
        
        // Update AccountVotes
        let account_votes = borrow_global_mut<AccountVotes>(account_addr);
        if (!table::contains(&account_votes.beta_votes, beta_name)) {
            table::add(&mut account_votes.beta_votes, beta_name, 0);
        };
        let vote_count = table::borrow_mut(&mut account_votes.beta_votes, beta_name);
        *vote_count = *vote_count + 1;
    }

    /// View all votes for a specific alpha
    #[view]
    public fun view_alpha_votes(alpha_name: String): (u64, vector<address>) acquires Votes {
        assert!(exists<Votes>(@alpha_voting_addr), E_NOT_INITIALIZED);
        let votes = borrow_global<Votes>(@alpha_voting_addr);
        
        if (table::contains(&votes.alpha_votes, alpha_name)) {
            let vote_info = table::borrow(&votes.alpha_votes, alpha_name);
            (vote_info.total_votes, *&vote_info.voters)
        } else {
            (0, vector::empty<address>()) // Return empty data if the alpha doesn't exist in the table
        }
    }

    /// View all votes for a specific beta
    #[view]
    public fun view_beta_votes(beta_name: String): (u64, vector<address>) acquires Votes {
        assert!(exists<Votes>(@alpha_voting_addr), E_NOT_INITIALIZED);
        let votes = borrow_global<Votes>(@alpha_voting_addr);
        
        if (table::contains(&votes.beta_votes, beta_name)) {
            let vote_info = table::borrow(&votes.beta_votes, beta_name);
            (vote_info.total_votes, *&vote_info.voters)
        } else {
            (0, vector::empty<address>()) // Return empty data if the beta doesn't exist in the table
        }
    }

    /// View the votes that an account voted for a particular alpha
    #[view]
    public fun view_account_votes_for_alpha(account_addr: address, alpha_name: String): u64 acquires AccountVotes {
        if (!exists<AccountVotes>(account_addr)) {
            return 0
        };
        
        let account_votes = borrow_global<AccountVotes>(account_addr);
        if (table::contains(&account_votes.alpha_votes, alpha_name)) {
            *table::borrow(&account_votes.alpha_votes, alpha_name)
        } else {
            0
        }
    }

    /// View the votes that an account voted for a particular beta
    #[view]
    public fun view_account_votes_for_beta(account_addr: address, beta_name: String): u64 acquires AccountVotes {
        if (!exists<AccountVotes>(account_addr)) {
            return 0
        };
        
        let account_votes = borrow_global<AccountVotes>(account_addr);
        if (table::contains(&account_votes.beta_votes, beta_name)) {
            *table::borrow(&account_votes.beta_votes, beta_name)
        } else {
            0
        }
    }

    #[test(account = @0x1)]
    public entry fun test_voting(account: signer) acquires Votes, AccountVotes {
        // Vote for different alphas and betas
        vote_alpha(&account, utf8(b"alpha1"));
        vote_alpha(&account, utf8(b"alpha1"));
        vote_alpha(&account, utf8(b"alpha2"));
        vote_beta(&account, utf8(b"beta1"));
        vote_beta(&account, utf8(b"beta1"));
        vote_beta(&account, utf8(b"beta2"));
        let account_addr = signer::address_of(&account);
        
        // Check all votes for alpha1
        let (total_votes, voters) = view_alpha_votes(utf8(b"alpha1"));
        assert!(total_votes == 2, 0);
        assert!(vector::length(&voters) == 1, 1);
        assert!(*vector::borrow(&voters, 0) == account_addr, 2);
        
        // Check account votes for alpha1
        let account_votes = view_account_votes_for_alpha(account_addr, utf8(b"alpha1"));
        assert!(account_votes == 2, 3);
        
        // Check account votes for alpha2
        let account_votes = view_account_votes_for_alpha(account_addr, utf8(b"alpha2"));
        assert!(account_votes == 1, 4);
        
        // Check all votes for beta1
        let (total_votes, voters) = view_beta_votes(utf8(b"beta1"));
        assert!(total_votes == 2, 5);
        assert!(vector::length(&voters) == 1, 6);
        assert!(*vector::borrow(&voters, 0) == account_addr, 7);
        
        // Check account votes for beta1
        let account_votes = view_account_votes_for_beta(account_addr, utf8(b"beta1"));
        assert!(account_votes == 2, 8);
        
        // Check account votes for beta2
        let account_votes = view_account_votes_for_beta(account_addr, utf8(b"beta2"));
        assert!(account_votes == 1, 9);
        
        // Check account votes for non-existent alpha and beta
        let account_votes = view_account_votes_for_alpha(account_addr, utf8(b"alpha3"));
        assert!(account_votes == 0, 10);
        let account_votes = view_account_votes_for_beta(account_addr, utf8(b"beta3"));
        assert!(account_votes == 0, 11);
    }
}