## Development

Requirements:

- [nvm](https://github.com/creationix/nvm)

Install :

- Install Node.js the required version (see [.nvmrc](.nvmrc) file):

```shell
nvm install
```

- Install Node.js modules:

```shell
yarn
```

- Create `.env` file and put enviroment values
  - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` : token from [mapbox](https://docs.mapbox.com/help/getting-started/access-tokens/)
  - `NEXT_PUBLIC_MAPBOX_STYLE_EXPLORE`: mapbox style
  - `NEXT_PUBLIC_DATA_API`: spreadsheet url

```shell
# template
cp .env.example .env
```

- Start development server:

```shell
yarn dev
```

You can see the app at [http://localhost:3000](http://localhost:3000)

### Configuration

You can modify the texts of the pages in the constant files that are in `src/config/constants/`

### Markdown documents

Static pages are generated from Markdown files located in the `public/markdown` folder. These files must have unique names and follow the Markdown format. The attributes `name` and `layout` are mandatory, while `kicker`, `title` and `sub_title` are optional. For virus related Markdown files, the `species` attribute is also required.

- virus file

```text
---
name: Guanarito virus
species:
  - Zygodontomys brevicauda
  - Sigmodon alstoni
layout: virus
---

# Guanarito virus
....

```

- home file

```text
---
name: home
kicker:
title: AtlasArena
sub_title: Climate change alters human risk for infectious diseases
layout: page
---

AtlasArena is a **Wellcome Trust**-funded
```

#### Considerations:

- you can add images and store them in the `images` folder:

```text
![image](images/image.webp)
```

- there are 4 types of documents (`virus, specie, page, publications`) these types are specified in the layout attribute.
- All files must have a `name` and `layout` field.
