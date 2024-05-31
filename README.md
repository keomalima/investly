# Investly

**Investly** is a full-stack stock management app that allows users to add, edit, and delete transactions, track the performance of their portfolio, and check detailed information about stocks.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [License](#license)

## Technologies Used

- **Design**: ![Figma](https://img.shields.io/badge/Figma%20-%23F24E1E.svg?style=flat&logo=figma&logoColor=white)
- **Frontend**: ![Vite](https://img.shields.io/badge/Vite%20-%23646CFF.svg?style=flat&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React%20-%2361DAFB.svg?style=flat&logo=react&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-%23764ABC.svg?style=flat&logo=redux&logoColor=white)
- **Backend**: ![Node.js](https://img.shields.io/badge/Node.js%20-%23339933.svg?style=flat&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express%20-%23000000.svg?style=flat&logo=express&logoColor=white)
- **Database**: ![PostgreSQL](https://img.shields.io/badge/PostgreSQL%20-%23336791.svg?style=flat&logo=postgresql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize%20-%2338B2AC.svg?style=flat&logo=sequelize&logoColor=white)
- **Hosting**: ![Render](https://img.shields.io/badge/Render%20-%2346E3B7.svg?style=flat&logo=render&logoColor=white)

## Features

- **Stock Information**: Access detailed information about stocks, including price history and key metrics, using a third-party API.

<img src="./frontend/src/assets/readmePictures/stock-info.png" alt="Stock Info" width="500"/>

<br>

- **Portfolio Performance**: Monitor the performance of your investment portfolio in real-time.

<img src="./frontend/src/assets/readmePictures/dashboard.png" alt="Dashboard" width="500"/>

<br>

- **Manage Transactions**: Easily log and edit your stock transactions including buys and sells.

<img src="./frontend/src/assets/readmePictures/new-transaction.png" alt="New Transaction" width="500"/>

<br>

- **Theme M:** Customizable theme that includes both light and dark options for a more comfortable viewing experience.

<img src="./frontend/src/assets/readmePictures/light-mode1-modified.png" alt="Light Mode" width="500"/>

<br>

- **User Authentication**: Secure user authentication and session management.

<img src="./frontend/src/assets/readmePictures/login.png" alt="Login" width="500"/>

## Usage

To use the application:

1. Navigate to [Investly Live Demo](http://investly.keomalima.com).
2. Register or use the demo user.
3. Start adding transactions from your favorite stocks (ie: AAPL, MSFT, DIS etc) and monitor your portfolio performance.

## Project Structure

- **Frontend**: Built with React, using Vite and Redux for state management. The UI is designed in Figma. All components, including forms, cards, and tables, were created manually, with minimal use of external libraries.
- **Backend**: Powered by Node.js and Express, with Sequelize managing database interactions and PostgreSQL as the database.
- **Database**: Utilizes PostgreSQL for storing user and stock data, accessed and manipulated through Sequelize ORM.
- **Third-Party API**: Used to fetch real-time stock information and historical data.

### Key Files and Directories

- `frontend/`: Contains all the React components, Redux store, and assets.
- `backend/`: Includes Express server setup, API routes, and database models.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
