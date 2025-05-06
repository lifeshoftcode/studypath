# StudyPath

StudyPath is a web application designed to help students track their academic progress through their curriculum. It provides a user-friendly interface to manage courses, view progress, and receive AI-generated recommendations for academic success.

## Features

- Track academic progress through a curriculum
- View detailed information about courses and terms
- Receive AI-generated recommendations for academic success
- Import and export curriculum data in JSON format
- User authentication and authorization

## Installation

To get started with StudyPath, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/lifeshoftcode/studypath.git
   cd studypath
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`. 

- **Login/Register**: Create an account or log in with your existing credentials.
- **Dashboard**: View your curriculum and track your progress.
- **AI Recommendations**: Get personalized recommendations based on your academic progress.
- **Import/Export**: Import or export your curriculum data in JSON format.

## Deployment

To deploy the application, follow these steps:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service.

## Dependencies

StudyPath relies on the following dependencies:

- `@genkit-ai/googleai`: AI integration for recommendations
- `@reduxjs/toolkit`: State management
- `@tailwindcss/vite`: Tailwind CSS integration
- `firebase`: Firebase for authentication and database
- `genkit`: AI integration
- `react`: React library
- `react-dom`: React DOM library
- `react-redux`: React bindings for Redux
- `react-router-dom`: Routing library
- `styled-components`: CSS-in-JS library
- `tailwindcss`: Utility-first CSS framework

## Project Structure

The project structure is organized as follows:

```
studypath/
├── public/                 # Public assets
│   ├── pensum_example.json # Example curriculum data
│   ├── vite.svg            # Vite logo
├── src/                    # Source code
│   ├── assets/             # Static assets
│   ├── components/         # Reusable components
│   ├── data/               # Data models and sample data
│   ├── firebase/           # Firebase configuration
│   ├── pages/              # Page components
│   ├── redux/              # Redux slices and store
│   ├── routes/             # Route definitions
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles
│   ├── main.jsx            # Entry point
├── .env.example            # Example environment variables
├── .firebaserc             # Firebase project configuration
├── firebase.json           # Firebase configuration
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── vite.config.js          # Vite configuration
```

## Contribution Guidelines

We welcome contributions to StudyPath! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

## Contact

For support or inquiries, please contact us at [support@studypath.com](mailto:support@studypath.com).
