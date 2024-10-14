# Project Overview
![Lets Cook!](https://cdn.dorahacks.io/static/files/1928685a1b1215cfcceb82f432895c74.png)
Introducing Cook App - Powered by Aptos.

Your fastest and most fun way to participate & get the latest alpha in crypto. Oh, and earn while you swipe!

In a normie explanation, cook app is a fun social discovery platform that rewards users who contribute to filtering out great value content from noise, and for those who wants to consume top level summary of alpha from whitelisted accounts.

## BUIDL Details
1. Sample move object code has been deployed and may refer [here](https://explorer.aptoslabs.com/object/0x63278981c03c45fb270f468a2e157bc32b48f8b0e6e65eaa4c8705c179b5a6f9/modules/code/alpha_voting?network=testnet). 

2. Official dorahacks buidl has been submitted [here](https://dorahacks.io/buidl/16797/)

3. Live Demo available at:
- Telegram: https://t.me/Cook_testing123_bot (start with typing "/start)" in the bot.(Please sign-in with Mizu wallet as Aptos Connect has a bug. Already reported at https://github.com/aptos-labs/aptos-developer-discussions/discussions/482 )

## Tech Stack Overview

- Framework - [Next.js 14](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Aptos Typescript SDK - [aptos-ts-sdk](https://aptos.dev/en/build/sdks/ts-sdk)
- Move Smart Contract -[aptos-move](https://aptos.dev/en/build/smart-contracts)
- Aptos Wallet Adapter/Mizu Wallet Sdk - [wallet-adapter](https://aptos.dev/en/build/sdks/wallet-adapter)
- SwiperJS -[swiper](https://swiperjs.com/)
- Nodit - [nodit](https://nodit.io/)
- Tanstack React Query -[tanstack](https://tanstack.com/query/v3)
- Framer Motion -[framer-motion](https://www.framer.com/motion/)


## Getting Started

Follow these steps to clone the repository and start the development server:

- `git clone https://github.com/Purifiedhuman/ctsmesh-web.git`
- `npm install`
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file. In this case, we will need `NEXT_PUBLIC_MODULE_ADDRESS` and `NEXT_PUBLIC_SPONSOR_PRIVATE_KEY_HEX` to make the project run. We have also provided default object address and sponsor private hex.
- `npm run dev`

You should now be able to access the application at http://localhost:3000.

## Example Move Source code compile

1. cd into your move directory folder
2. aptos init
3. aptos move compile --named-addresses <your_module_name>=<your_address>
4. aptos move deploy-object --address-name <your_module_name> --skip-fetch-latest-git-deps

Full aptos deploy guide [here](https://aptos.dev/en/build/smart-contracts/deployment) .


## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.