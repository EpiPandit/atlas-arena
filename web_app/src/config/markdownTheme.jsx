import {
  Text,
  Heading,
  Link,
  Code,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';

const MarkdownTheme = {
  p: (props) => {
    const { children } = props;
    return (
      <Text variant={'secondary-text'} lineHeight={2} p='0.5em 0'>
        {children}
      </Text>
    );
  },
  h1: (props) => {
    const { children } = props;
    return (
      <Heading variant={'secondary-heading'} lineHeight={2}>
        {children}
      </Heading>
    );
  },
  h2: (props) => {
    const { children } = props;
    return (
      <Heading variant={'secondary-heading'} lineHeight={2}>
        {children}
      </Heading>
    );
  },
  a: (props) => {
    const { href, children } = props;
    return (
      <Link
        href={href}
        variant={'secondary-text'}
        textDecoration='underline'
        cursor='pointer'
        fontWeight='bold'
        lineHeight={2}
        target='_blank'
      >
        {children}
      </Link>
    );
  },
  code: (props) => {
    const { children } = props;
    // console.log("props", props)
    console.log(children.includes('\n'));
    if (children.includes('\n')) {
      return (
        <Code
          children={children}
          colorScheme='purple'
          width='100%'
          p='1em 1em'
        />
      );
    } else {
      return (
        <a style={{ backgroundColor: 'lightgray', padding: '0 0.2em' }}>
          {children}
        </a>
      );
    }
  },
  li: (props) => {
    const { children } = props;
    return (
      <UnorderedList>
        <ListItem>
          <Text variant={'secondary-text'} lineHeight={2}>
            {children}
          </Text>
        </ListItem>
      </UnorderedList>
    );
  },
};

export default MarkdownTheme;
