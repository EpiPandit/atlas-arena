import {
  Text,
  Heading,
  Link,
  Code,
  UnorderedList,
  OrderedList,
  ListItem,
  Box,
  Blockquote,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  AspectRatio,
} from '@chakra-ui/react';

const MarkdownTheme = {
  p: (props) => {
    const { children } = props;
    return (
      <Text variant='secondary-text' fontSize='md' lineHeight='tall' py={2}>
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
      <Heading
        as='h2'
        variant='secondary-heading'
        fontSize='xl'
        lineHeight='taller'
        py={3}
      >
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
          colorScheme='purple'
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
        <Code colorScheme='gray' p={1} borderRadius='md' bg='gray.100'>
          {children}
        </Code>
      );
    }
  },
  blockquote: (props) => {
    const { children } = props;
    const bgColor = 'gray.100';
    return (
      <Blockquote
        bg={bgColor}
        borderLeft='4px solid'
        borderColor='gray.400'
        p={4}
        m={4}
        borderRadius='md'
      >
        {children}
      </Blockquote>
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
    return <UnorderedList pl={4}>{children}</UnorderedList>;
  },
  ol: (props) => {
    const { children } = props;
    return <OrderedList pl={4}>{children}</OrderedList>;
  },
  li: (props) => {
    const { children } = props;
    return (
      <ListItem>
        <Text variant='secondary-text' lineHeight='tall'>
          {children}
        </Text>
      </ListItem>
    );
  },
  table: (props) => {
    return (
      <Table variant='simple' my={4} width='100%' textAlign='left'>
        {props.children}
      </Table>
    );
  },
  thead: (props) => {
    return (
      <Thead bg={useColorModeValue('gray.200', 'gray.600')}>
        {props.children}
      </Thead>
    );
  },
  tbody: (props) => {
    return <Tbody>{props.children}</Tbody>;
  },
  tr: (props) => {
    return <Tr>{props.children}</Tr>;
  },
  th: (props) => {
    return (
      <Th
        fontWeight='bold'
        borderColor={useColorModeValue('gray.300', 'gray.600')}
      >
        {props.children}
      </Th>
    );
  },
  td: (props) => {
    return (
      <Td borderColor={useColorModeValue('gray.300', 'gray.600')}>
        {props.children}
      </Td>
    );
  },
  iframe: (props) => {
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
