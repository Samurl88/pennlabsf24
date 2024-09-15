# Hi, welcome to my take on Penn Course Cart!
I've put a huge emphasis on making my website intuitive to use, so feel free to jump right on in!

## Features
- Searching: Matches search term with title, course code, and/or description. If the term is an exact match for a class, or there's only one match, the website will automatically highlight that result. Visible button to add or remove classes, and small icons to indicate which classes that have appeared in search are already in the user's cart
- Cart: Visible cart that allows for quick review/removal of courses (additionally, added alerts for when cart has exceeded capacity
- Checkout: Uses React Router's useSearchParams to pass information via query parameters (there's lots of confetti)

## Additional features
- Home page suggestions: Selects random classes to display on home page for the user to explore.
- Course difficulty and quality ratings: For some reason, I couldn't connect to the API, so I manually recorded ratings of difficulty and quality for each class. Ratings are shown in the form of circular progress bars when the user expands on a class that has appeared in search.
- Related classes: Intelligently takes classes from listed prerequisites and suggests such classes throughout search process
- Course roulette: Enough said.
