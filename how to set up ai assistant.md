The FLYEST store helper uses automatic, rule-based replies in the browser. It does not use AI, an external API, or an API key.

1. Install Node.js 18 or newer.
2. Start the site:

   ```powershell
   npm start
   ```

3. Open `http://localhost:3000` (not the HTML file using a `file://` URL and not the static preview on port 8787).

## Deploy the site and assistant to Render

This project includes a Render Blueprint in `render.yaml`. It deploys the storefront and automatic store helper together. The helper runs in the visitor's browser and does not require API credentials.

1. Sign in to [Render](https://dashboard.render.com/) using the GitHub account that owns this repository.
2. In Render, create a new **Blueprint** and select the `sample-2-flyest` GitHub repository.
3. Review the `flyest-store` web service from `render.yaml` and deploy it.
4. Open the service's `onrender.com` URL. The store helper replies without any key or paid API plan.

The Render Free service may spin down when idle, so the first page load after inactivity can take longer. The automatic helper itself does not depend on an external AI service. GitHub Pages also serves the helper because it runs in the browser.

The helper is designed for common store questions. It does not look up live orders or guarantee refunds; direct customers to FLYEST support when a question needs a person. Do not collect payment credentials or sensitive personal details in chat.
