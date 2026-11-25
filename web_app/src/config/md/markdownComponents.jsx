import {
  Box,
  Code,
  Heading,
  Image,
  Link,
  List,
  Separator,
  Table,
  Text,
  chakra,
} from '@chakra-ui/react';

// Chakra v3 renderers for react-markdown, replacing chakra-ui-markdown-renderer
// (v2 only). A theme (e.g. markdownTheme) overrides any of these per tag.
const heading =
  (level, size) =>
  ({ children }) => (
    <Heading as={`h${level}`} size={size} my={4}>
      {children}
    </Heading>
  );

const defaults = {
  p: ({ children }) => <Text mb={2}>{children}</Text>,
  em: ({ children }) => <Text as='em'>{children}</Text>,
  del: ({ children }) => <Text as='del'>{children}</Text>,
  blockquote: ({ children }) => (
    <Box as='blockquote' p={2}>
      {children}
    </Box>
  ),
  code: ({ children, className }) => (
    <Code className={className} whiteSpace='break-spaces' p={2}>
      {children}
    </Code>
  ),
  pre: ({ children }) => <chakra.pre>{children}</chakra.pre>,
  hr: () => <Separator />,
  a: ({ href, children }) => <Link href={href}>{children}</Link>,
  img: ({ src, alt }) => <Image src={src} alt={alt ?? ''} />,
  ul: ({ children }) => (
    <List.Root as='ul' pl={4} gap={2}>
      {children}
    </List.Root>
  ),
  ol: ({ children }) => (
    <List.Root as='ol' pl={4} gap={2}>
      {children}
    </List.Root>
  ),
  li: ({ children }) => <List.Item>{children}</List.Item>,
  h1: heading(1, '4xl'),
  h2: heading(2, '3xl'),
  h3: heading(3, '2xl'),
  h4: heading(4, 'xl'),
  h5: heading(5, 'lg'),
  h6: heading(6, 'md'),
  table: ({ children }) => <Table.Root>{children}</Table.Root>,
  thead: ({ children }) => <Table.Header>{children}</Table.Header>,
  tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
  tr: ({ children }) => <Table.Row>{children}</Table.Row>,
  th: ({ children }) => <Table.ColumnHeader>{children}</Table.ColumnHeader>,
  td: ({ children }) => <Table.Cell>{children}</Table.Cell>,
};

export const markdownComponents = (theme = {}) => ({ ...defaults, ...theme });
