# Investly

**Investly** is a stock management app that allows users to add new transactions, track the performance of their portfolio, and check detailed information about stocks. This full-stack application provides an efficient way to manage your investments and track their performance.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [License](#license)

## Features

- **Portfolio Performance**: Monitor the performance of your investment portfolio in real-time.

![Dashboard](images/dashboard.png)

- **Stock Information**: Access detailed information about stocks, including price history and key metrics, using a third-party API.

![Stock Details](images/dashboard.png)

- **Add New Transactions**: Easily log your stock transactions including buys and sells.

![Add Transaction](images/add-transaction.png)

- **Dark Mode:**: Enjoy a dark theme for a more comfortable viewing experience in low-light environments.

![Dark Mode](images/add-transaction.png)

- **User Authentication**: Secure user authentication and session management.

## Technologies Used

- **Design**: ![Figma](https://img.shields.io/badge/Figma%20-%23F24E1E.svg?style=flat&logo=figma&logoColor=white)
- **Frontend**: ![Vite](https://img.shields.io/badge/Vite%20-%23646CFF.svg?style=flat&logo=vite&logoColor=white), ![React](https://img.shields.io/badge/React%20-%2361DAFB.svg?style=flat&logo=react&logoColor=white), ![Node.js](https://img.shields.io/badge/Node.js%20-%23339933.svg?style=flat&logo=nodedotjs&logoColor=white)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Sequelize ORM)
- **Hosting**: Render

## Usage

To use the application:

1. Open your browser and navigate to [Investly Live Demo](http://investly.keomalima.com).
2. Register or use the demo user.
3. Start adding transactions and monitor your portfolio performance.

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
