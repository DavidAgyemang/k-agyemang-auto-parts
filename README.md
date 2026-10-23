# K. Agyemang Auto Parts website

A fast, static website (HTML, CSS and plain JavaScript) for GitHub Pages. No server, no database and no paid service is needed to show it.

## 1. What is in this folder

The site uses a **flat layout**: every file sits in the main folder of the repository, with no sub-folders. This keeps uploading to GitHub simple.

```
index.html, services.html, garages.html, about.html, contact.html,
request.html, privacy.html, terms.html, 404.html   The pages
style.css            All styling. Colours and fonts are at the top, in :root
config.js            YOUR CONTACT DETAILS. Edit this file to change numbers and links
main.js              Menu, form checks, WhatsApp message builder
sitemap.xml, robots.txt   For search engines
*.jpg, favicon.svg   Photos, business card, WeChat QR, favicon, social image
supplier-visit-1..4.mp4   The four supplier visit clips
inter-*.woff, heros-cn-bold.woff   Fonts (self-hosted, no Google Fonts)
```

All links are relative (for example `style.css`, never `/style.css`), so the site works inside a GitHub Pages project address like `https://USERNAME.github.io/k-agyemang-auto-parts/`.

## 2. Put it on GitHub (no command line needed)

1. Unzip the folder on your computer.
2. Open your repository `k-agyemang-auto-parts` on github.com.
3. Click **Add file → Upload files**.
4. Open the unzipped folder, select **all the files inside it** and drag them into the browser. Do not drag the outer folder itself, because `index.html` must sit at the top level of the repository. The site uses a flat layout, so there are no sub-folders to upload.
5. Write a message such as `Add first version of website` and click **Commit changes**.

If you prefer the command line:

```bash
cd k-agyemang-auto-parts
git init
git add .
git commit -m "Add first version of website"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/k-agyemang-auto-parts.git
git push -u origin main
```

## 3. Turn on GitHub Pages

1. In the repository click **Settings**.
2. In the left menu click **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch** choose **main** and the folder **/(root)**, then click **Save**.
5. Wait one to two minutes. Refresh the Pages screen until it shows **Your site is live at** and a link. It will look like `https://YOUR-GITHUB-USERNAME.github.io/k-agyemang-auto-parts/`.

## 4. Web address and search engines

The social sharing tags, `sitemap.xml` and `robots.txt` already use `https://davidagyemang.github.io/k-agyemang-auto-parts/`. When you buy a custom domain later, replace that address with `https://yourdomain.com` in the `.html` files, `sitemap.xml` and `robots.txt` (find and replace), then add the domain under **Settings → Pages → Custom domain**.

To appear in Google: add your site in Google Search Console (search.google.com/search-console), verify it, submit `sitemap.xml`, and use URL Inspection, then "Request indexing". New sites can take days to weeks to show up.

## 5. Change contact details (one place only)

Open `config.js`. It holds the WhatsApp number, phone number, email, Instagram, LinkedIn and WeChat QR file name.

- `whatsappNumber` is digits only with the country code, no `+` or spaces (for example `233549498212`). It powers every "Chat on WhatsApp" button and the Request a Part form.
- Leave a value as `""` to hide it. The **email** is empty now, so no email appears anywhere. Add `email: "info@yourdomain.com"` when you have one and it shows up on the contact page and footer by itself.
- If `whatsappNumber` is empty, the forms tell the visitor that WhatsApp is not set up and do not pretend a request was sent.
- Never put passwords or API keys in this file. Anyone can read it.

## 6. How the Request a Part form works today

A static website cannot safely receive and store form submissions. So the form does this:

1. It checks the fields (required fields, phone number, year, quantity, chassis number format, optional email).
2. It builds a readable message from the answers, right inside the visitor's browser.
3. It opens WhatsApp with that message ready in a chat with your number. **The request is only sent when the customer presses Send in WhatsApp.** The page says this clearly.
4. A "Copy request text" button is the backup if the WhatsApp link is blocked.

Things to know:

- **Photos cannot be attached by a website.** The page tells customers to attach photos themselves in WhatsApp.
- **Nothing is stored.** No localStorage, no cookies, no analytics.
- The home page finder and the category rows send customers to the form with the vehicle or part already filled in, using the web address (for example `request.html?make=Toyota&part=Grille`).
- The business enquiry form on `garages.html` works the same way.
- To change the wording of the WhatsApp message, edit the `BUILDERS` section in `main.js`.

## 7. What needs a backend later (not built, on purpose)

These need a server and a database. They are not faked on this website.

| Feature | Why it needs a backend |
| --- | --- |
| Storing requests so you can search them | Needs a database (for example PostgreSQL) |
| Customer accounts and login | Needs secure password handling and sessions |
| Order tracking | Needs stored orders and status updates |
| Supplier management and quotation management | Needs a database and an admin interface |
| Email or SMS notifications | Needs a server to send messages with secret keys |
| Admin dashboard | Needs login, roles and a database |
| Inventory integrations | Needs server-side connections to stock systems |
| Automated compatibility assistance | Needs a parts database and server logic |

A sensible path: build a Python FastAPI or Django service with PostgreSQL. Then change the form so that after validation it sends the data to your API instead of opening WhatsApp. In `main.js`, `readForm(form)` already returns every answer as a simple object, ready to send as JSON with `fetch`. Until then, a hosted form service (such as Formspree or Web3Forms) is a quick step that does not need your own server.

## 8. Updating the site after it is live

- **Small text change:** open the file on github.com, click the pencil icon, edit, and commit. The site updates in one to two minutes.
- **New photo:** upload it to the main folder, then use its file name in the HTML (see section 10 for how to swap an image).
- **Bigger changes:** edit on your computer, then `git add .`, `git commit -m "Describe the change"`, `git push`.
- If you do not see the change, hard refresh the page (Ctrl+Shift+R, or Cmd+Shift+R on a Mac).

## 9. Legal pages and photos: please read

- `privacy.html` and `terms.html` are **starter texts**. They describe how this website works today. Have them reviewed by a qualified person and add your returns and warranty policy. Ghana's Data Protection Act, 2012 (Act 843) may apply to your business, so check whether you need to register with the Data Protection Commission.
- **Photos of other people:** the photos from the trade event and the supplier visit show other people. Get their permission (a WhatsApp message is enough) before keeping them on a public website. To remove one, delete its `<figure>` block in `about.html`.
- `delegation-selfie.jpg` is included but not used on any page.
- The business facts on the site came from you: established 1995 (from your business card), shops in Suame and Abossey Okai, and delivery across Ghana. Correct them in the HTML if anything is wrong.

## 10. Troubleshooting

**The page looks plain (no colours or layout).** The CSS file is not loading.
- Check that `style.css` is in the main list of files, next to `index.html`, and spelled exactly like that (names are case sensitive on GitHub).
- Check you uploaded the contents of the folder, not the outer folder. Opening `https://USERNAME.github.io/k-agyemang-auto-parts/style.css` should show the CSS text.

**Images or videos do not show.**
- Open the browser developer tools (F12) and look at the **Network** tab for red 404 lines. They show the exact path that failed.
- Make sure the file name in the HTML matches the real file, including capital letters and `.jpg` against `.jpeg`.
- To swap a photo, upload the new file into the main folder and change the `src="..."` text in the HTML. Keep the `alt="..."` description accurate.

**A link goes to the wrong place or a 404 page.**
- Links must be relative, like `contact.html`. A link that starts with `/` (like `/contact.html`) breaks on a project site.
- Page names are case sensitive: `Contact.html` is not `contact.html`.

**The site does not update.** In the repository open the **Actions** tab. A recent "pages build and deployment" run should show a green tick. Then hard refresh.

**WhatsApp does not open from the form.** Some browsers block pop-ups. Use the **Open WhatsApp** button under the message preview, or **Copy request text**.

## 11. Checklist before you share the link

Desktop and phone:

- [ ] Every menu link opens the right page, and the current page is underlined
- [ ] On a phone, the Menu button opens and closes the menu (also with the Escape key)
- [ ] The home page finder opens the request form with the vehicle and part filled in
- [ ] Submitting an empty request form shows clear errors and moves you to the first one
- [ ] A valid request opens WhatsApp with a readable message that has your number
- [ ] "Chat on WhatsApp", "Call us", Instagram and LinkedIn links work
- [ ] The four supplier videos play, and starting one pauses the others
- [ ] The WeChat QR code scans from a phone screen
- [ ] No page scrolls sideways on a phone
- [ ] Tab through a page with the keyboard: the focus outline is always visible
- [ ] Privacy and terms pages reviewed (section 9) and permission obtained for photos of other people

## 12. What works now and what needs outside services

| Works now, with no extra services | Needs an outside service |
| --- | --- |
| All pages and navigation | Receiving requests without WhatsApp (form service or backend) |
| Mobile menu, FAQ, videos, galleries | Photo upload (form service or backend) |
| Request form checks and WhatsApp message | Email address and email notifications (domain and mail service) |
| Prefilled forms from links | Customer accounts, order tracking, admin dashboard (backend) |
| Contact links and QR code | Custom domain (a domain name purchase) |
| Open Graph tags, favicon, structured data | Visitor statistics (analytics service, if you ever want them) |

## 13. Credits

- Fonts: Inter (SIL Open Font License) and TeX Gyre Heros Cn (GUST Font License), self-hosted.
- All photos, videos and the business card are your own.
