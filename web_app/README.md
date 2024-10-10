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
  - `NEXT_PUBLIC_MAPBOX_STYLE`: mapbox style
  - `NEXT_PUBLIC_DATA_API`: spreadsheet api

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

Static pages come from markdown files, these files are located in the `public/markdown` folder.

#### Considerations:

- you can add images and store them in the `images` folder:

```text
![image](images/image.webp)
```

- there are 3 types of documents (`virus, species, page`) these types are specified in the layout attribute.
- All files must have a `name` and `layout` field.
