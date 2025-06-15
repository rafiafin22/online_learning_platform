## 🚀 Requirements

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* [MySQL Workbench](https://www.mysql.com/products/workbench/)

---

## 🛠️ Installation

Follow these steps to get the project up and running:

1. **Create a new Next.js project**

   ```bash
   npx create-next-app@latest
   ```

2. **Copy project files**

   Copy all files from this repository into your newly created Next.js project folder, replacing any necessary files.

3. **Set up the database**

   * Open **MySQL Workbench**
   * Run the SQL schema file found in the `scripts` folder to create the required database and tables.
  
4. **Set up the .env.local file**

   * Open `.env.local` file located on the root folder.
   * Change the database credential based on your MySQL Workbench settings.

5. **Build the project**

   Navigate to your project directory and run:

   ```bash
   npm run build
   ```

6. **Start the development server**

   ```bash
   npm run start
   ```
