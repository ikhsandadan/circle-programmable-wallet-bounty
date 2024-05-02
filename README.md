# Circle Programmable Wallet Bounty by StackUp and Circle


For this project's bounty, I have created a web application for a programmable wallet based on Next.js and React. I will explain each page of the web application in detail.

First, if the user is not registered, I have implemented social login with a Google account or GitHub account using NextAuth.

![1](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/611a06cb-f88a-459c-bee4-2373660085a3)


After the user logs in with their Google or GitHub account, they will be asked to create a User ID that will be registered with the Circle User ID and stored in the database (in this case, I'm using MongoDB).

![2](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/6c41e7f6-262f-45ed-a051-7b6a8c0a94af)


After the user submits the form above, a "modal" will open, which is a Circle Web SDK that will automatically fill in the user token, encryption key, and challenge ID to confirm the creation of the Circle User ID (subsequently, whenever the user's activity requires confirmation through a challenge ID, the Circle Web SDK modal will automatically open).

![4](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/14ad9134-b3a0-4866-8ea3-4c4c53e6350f)


Once the Circle User ID creation process is complete, all the features of this application can be used by the user, as I will describe below.


 **1. Home**
 ![3](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/2dd451a6-03da-40ee-8cda-a45e8e1ac550)

 The Home page will display the User ID of the user, when the User ID was created, and the PIN Status (If the user has set a PIN, it will show "ENABLED," and if not, it will show "UNSET," while the "Update PIN" button will change to "Set PIN"). The "Update PIN" button is used to change the user's PIN. There is also a "Reset PIN" button that allows the user to reset their PIN by providing a recovery answer.
 
![5](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/cef4b270-54eb-4c33-b67c-672caa74d14a)


At the bottom, there is a feature to add testnet faucet to the desired user wallet and the desired token, but this feature will only appear if the user has already created a wallet on the wallet page, which I will explain below.

![15](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/602b6e95-3334-4c56-b0cd-3eb25170b0ea)


 **2. My Wallets**
 ![7](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/5e29bf28-e0e0-4dd5-a4d5-b6f05892cc3e)

 This page displays all the wallets owned by the user. If the user does not have a wallet yet, they can create one by clicking the "Create New Wallet" button, which will display the following modal.
 ![8](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/981f07cf-8798-4ec4-a303-edeca17c8fb7)

 After the user creates a wallet, it will appear on this page, as shown in the image below.
 ![9](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/17477967-0c96-4ede-b2fc-b2d3fe112dec)

 Each wallet can also have its name and description changed.


 **3. Transfer**
 ![12](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/a7d5a345-b2cb-4c40-a75a-cd053fd69371)

 On this page, the user can transfer the desired token. Here, the user can also choose which wallet to use, which token has funds, select the token to be transferred, the amount, the destination address (in this case, the user can choose from their contact list or enter a new address, and they can also choose whether to add the address to their contact list or not).


 **4. Transaction History**
![13](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/07dd51ce-b3b2-4eb2-b7cd-6473b62a0c1d)

On this page, the user can view all transactions made by each of their wallets.

 **5. My Profile**
 ![11](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/5abd6fa9-9cfe-4782-bc3a-d35697021ef1)

 This page displays all the user's information and their contact list. I store the user's contact list in the MongoDB user database. Here, the user can also add new contacts, delete contacts, and edit contacts.
![14](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/f8e13fcc-5c03-4c3c-9901-59285594697a)


Lastly, I have also implemented notifications for all user activities, as shown in the example below.
![16](https://github.com/ikhsandadan/circle-programmable-wallet-bounty/assets/116878888/9454bb63-b95b-468a-99e9-d92c6f1eb559)


