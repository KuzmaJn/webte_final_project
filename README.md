# Spaceship vs Aliens

Spaceship vs Aliens is a web-based game inspired by the classic arcade game Space Invaders. The game is built using Vue.js and p5.js for rendering the game graphics.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/spaceship-vs-aliens.git
    cd spaceship-vs-aliens
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

To run the project locally, use the following command:
```sh
npm run serve
```
This will start a local development server. Open your browser and navigate to `http://localhost:8080` to see the application in action.

## Game Rules

### Objective
The goal of the game is to score as many points as possible by shooting down aliens.

### Controls
- **A, D**: Move the spaceship left and right.
- **SPACE**: Shoot bullets.

### Scoring
- **Red Alien**: 10 points
- **Yellow Alien**: 20 points
- **Green Alien**: 30 points
- **Extra Alien**: 50 points

### Levels
The game consists of multiple levels, each with increasing difficulty. Complete all levels to win the game.

## Development

### Project Structure
- `src/App.vue`: Main application component.
- `src/components`: Contains Vue components like `Home.vue`, `HowToPlay.vue`, `Game.vue`, and `RuleBlock.vue`.
- `src/assets`: Contains game assets like images and fonts.
- `src/store`: Contains Vuex store for managing game state.
- `src/styles`: Contains CSS files for styling the application.

### Scripts
- `npm run serve`: Compiles and hot-reloads for development.
- `npm run build`: Compiles and minifies for production.
- `npm run lint`: Lints and fixes files.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## About
This project is a school project inspired by the classic arcade game *Space Invaders*.  
All assets used are open-source and appropriately credited.
