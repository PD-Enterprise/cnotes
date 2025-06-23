# Cnotes

Cnotes is a modern, cloud-based note-taking application built with SvelteKit, offering a seamless, secure, and collaborative experience for organizing your personal notes.

## Features

- **Intuitive Interface**: Clean, modern UI for efficient note-taking.
- **Secure Cloud Storage**: Notes are encrypted and synced across devices.
- **Smart Organization**: Tag, categorize, and search your notes with ease.
- **Collaborative Sharing**: Share notes and collaborate in real-time.
- **Rich Text Formatting**: Support for rich text, code snippets, images, and more.
- **Offline Support**: Access and edit notes even when offline (via localStorage).
- **Metadata Management**: Add metadata like subject, grade, board, and creation date to each note.

## Tech Stack

- **Frontend**: SvelteKit, TailwindCSS, DaisyUI
- **Rich Text Editor**: Tipex, Tiptap Extensions
- **Authentication**: Auth0
- **Cloud Database**: Neon Database (via `@neondatabase/serverless`)
- **Other**: Svelte Toasts, Excalidraw (planned for diagrams), TinyMCE (planned)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn (or npm)

### Installation

```bash
# Clone the repository
$ git clone https://github.com/PD-Enterprise/cnotes
$ cd cnotes

# Install dependencies
yarn install
# or
npm install
```

### Development

```bash
yarn dev
# or
npm run dev
```

The app will be available at [https://cnotes.pages.dev](https://cnotes.pages.dev).

### Build

```bash
yarn build
# or
npm run build
```

### Preview Production Build

```bash
yarn preview
# or
npm run preview
```

## Usage

- **Landing Page**: Introduces the app and its features. Click "Try it Out" to start.
- **Home**: View, search, and organize your notes. Notes are synced between localStorage and the cloud.
- **Create Note**: Add new notes (text notes available, diagrams coming soon).
- **Note Details**: View and edit note content and metadata. Save changes to the cloud.
- **Sharing**: Share notes via a unique link for collaboration.
- **Authentication**: Secure login and registration via Auth0.

## Project Structure

```
src/
  routes/
    +page.svelte         # Landing page
    home/
      +page.svelte       # Main notes dashboard
      new-note/          # Create new note
      [noteslug]/        # View/edit individual note
        sharing/         # Share/collaborate on note
    components/          # Svelte components (notes, editors, etc.)
  lib/
    utils/               # Utility functions (API config, validation, etc.)
    stores/              # Svelte stores for state management
static/                  # Static assets
```

## Configuration

- API URLs and other environment variables are managed in `.env` and `src/lib/utils/apiConfig.ts`.
- Authentication is configured in `src/lib/utils/authConfig.ts`.

## Dependencies

See [`package.json`](./package.json) for a full list. Key dependencies include:

- `@sveltejs/kit`, `svelte`, `vite`, `tailwindcss`, `daisyui`
- `@auth0/auth0-spa-js` for authentication
- `@friendofsvelte/tipex`, `@tiptap/extension-*` for rich text editing
- `@neondatabase/serverless` for cloud database
- `svelte-toasts` for notifications

## Roadmap

- [ ] Diagram note support (Excalidraw integration)
- [ ] Diagram embed support

## Contact

Questions or feedback? [Contact us!](https://pd-enterprise.pages.dev/contact-us)
