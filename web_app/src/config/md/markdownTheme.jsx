import {
  Text,
  Heading,
  Link,
  Code,
  Box,
  Table,
  AspectRatio,
  List,
} from '@chakra-ui/react';

const MarkdownTheme = {
  p: (props) => {
    const { children } = props;
    return (
      <Text fontSize='md' lineHeight='tall' py={2}>
        {children}
      </Text>
    );
  },
  h1: (props) => {
    const { children } = props;
    return (
      <Heading as='h1' fontSize='2xl' lineHeight='taller' py={4}>
        {children}
      </Heading>
    );
  },
  h2: (props) => {
    const { children } = props;
    return (
      <Heading as='h2' fontSize='xl' lineHeight='taller' py={3}>
        {children}
      </Heading>
    );
  },
  h3: (props) => {
    const { children } = props;
    return (
      <Heading
        as='h3'
        fontSize='lg'
        fontWeight='bold'
        lineHeight='taller'
        py={3}
      >
        {children}
      </Heading>
    );
  },
  h4: (props) => {
    const { children } = props;
    return (
      <Heading
        as='h4'
        fontSize='md'
        fontWeight='semibold'
        lineHeight='taller'
        py={2}
      >
        {children}
      </Heading>
    );
  },
  h5: (props) => {
    const { children } = props;
    return (
      <Heading
        as='h5'
        fontSize='sm'
        fontWeight='medium'
        lineHeight='tall'
        py={2}
      >
        {children}
      </Heading>
    );
  },
  h6: (props) => {
    const { children } = props;
    return (
      <Heading
        as='h6'
        fontSize='xs'
        fontWeight='medium'
        lineHeight='tall'
        py={2}
      >
        {children}
      </Heading>
    );
  },
  a: (props) => {
    const { href, children } = props;
    const isExternal = href.startsWith('http');

    return (
      <Link
        href={isExternal ? href : `/${href}`}
        display='inline'
        color='blue.500'
        textDecoration='underline'
        fontWeight='bold'
        lineHeight='tall'
        target={isExternal ? '_blank' : '_self'}
        rel='noopener noreferrer'
        _hover={{ color: 'blue.700' }}
      >
        {children}
      </Link>
    );
  },
  code: (props) => {
    const { children } = props;
    if (children.includes('\n')) {
      return (
        <Code
          colorPalette='purple'
          width='100%'
          p={4}
          borderRadius='md'
          whiteSpace='pre-wrap'
        >
          {children}
        </Code>
      );
    } else {
      return (
        <Code colorPalette='gray' p={1} borderRadius='md' bg='gray.100'>
          {children}
        </Code>
      );
    }
  },
  blockquote: (props) => {
    const { children } = props;
    const bgColor = 'gray.100';
    return (
      <Box
        as='blockquote'
        bg={bgColor}
        borderLeft='4px solid'
        borderColor='gray.400'
        p={4}
        m={4}
        borderRadius='md'
      >
        {children}
      </Box>
    );
  },
  i: (props) => {
    const { children } = props;
    return (
      <Text as='i' fontStyle='italic' lineHeight='tall'>
        {children}
      </Text>
    );
  },
  b: (props) => {
    const { children } = props;
    return (
      <Text as='b' fontWeight='bold' lineHeight='tall'>
        {children}
      </Text>
    );
  },
  ul: (props) => {
    const { children } = props;
    return (
      <List.Root as='ul' pl={4}>
        {children}
      </List.Root>
    );
  },
  ol: (props) => {
    const { children } = props;
    return (
      <List.Root as='ol' pl={4}>
        {children}
      </List.Root>
    );
  },
  li: (props) => {
    const { children } = props;
    return (
      <List.Item>
        <Text lineHeight='tall'>{children}</Text>
      </List.Item>
    );
  },
  table: (props) => {
    return (
      <Table.Root variant='line' my={4} width='100%' textAlign='left'>
        {props.children}
      </Table.Root>
    );
  },
  thead: (props) => {
    return <Table.Header bg='gray.200'>{props.children}</Table.Header>;
  },
  tbody: (props) => {
    return <Table.Body>{props.children}</Table.Body>;
  },
  tr: (props) => {
    return <Table.Row>{props.children}</Table.Row>;
  },
  th: (props) => {
    return (
      <Table.ColumnHeader fontWeight='bold' borderColor='gray.300'>
        {props.children}
      </Table.ColumnHeader>
    );
  },
  td: (props) => {
    return <Table.Cell borderColor='gray.300'>{props.children}</Table.Cell>;
  },
  iframe: ({ node, ...props }) => {
    return (
      <AspectRatio maxW='100%' ratio={16 / 9}>
        <Box
          as='iframe'
          src={props.src}
          title={props.title || 'iframe content'}
          allowFullScreen
          {...props}
        />
      </AspectRatio>
    );
  },
};

export default MarkdownTheme;
