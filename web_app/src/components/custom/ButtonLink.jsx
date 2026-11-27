import React from 'react';
import { Button } from '@chakra-ui/react';

const ButtonLink = ({ href, text, ...props }) => {
  return (
    <Button size='md' p={4} {...props} asChild>
      <a href={href}>{text}</a>
    </Button>
  );
};

export default ButtonLink;
