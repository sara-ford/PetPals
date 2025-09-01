# PetPals 🐾

PetPals is a modern React web application designed to help users find and adopt pets. It features a user-friendly interface and uses a simple JSON database (`json.db`) for storing pet information and adoption requests.

## Features

- Browse available pets for adoption
- Search and filter pets by type, age, and breed
- View detailed pet profiles
- Submit adoption requests
- Responsive design for mobile and desktop
- Easy-to-customize JSON database backend

## Getting Started

### Prerequisites

- Node.js & npm installed
- (Optional) [json-server](https://github.com/typicode/json-server) for local JSON database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sara-ford/petpals.git
   cd petpals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON database**
   ```bash
   npx json-server --watch json.db --port 3001
   ```

4. **Start the React app**
   ```bash
   npm start
   ```

## Project Structure

```
petpals/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   └── index.js
├── json.db
├── package.json
└── README.md
```

## Customizing the Database

- All pet and adoption data is stored in `json.db`.
- To add pets, edit `json.db` directly or use the app’s admin interface (if available).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for new features, bug fixes, or suggestions.

## License

MIT

---

**Made with ❤️ by Sara Ford**
