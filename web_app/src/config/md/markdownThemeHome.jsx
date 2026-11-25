import { Text, Heading, Link, List } from '@chakra-ui/react';

const MarkdownThemeHome = {
  p: (props) => {
    const { children } = props;
    return (
      <Text
        lineHeight='tall'
        fontSize='lg'
        color='gray.700'
        textAlign='start'
        mx={0}
      >
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
    return (
      <Link
        href={href}
        display='inline'
        textDecoration='none'
        lineHeight='tall'
        rel='noopener noreferrer'
        _hover={{ color: 'blue.700' }}
      >
        {children}
      </Link>
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
};

export default MarkdownThemeHome;
