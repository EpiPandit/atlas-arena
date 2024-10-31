import React from 'react';
import { Button } from '@chakra-ui/react';

const ButtonLink = ({ href, text, ...props }) => {
  return (
    <Button size='md' p={4} as='a' href={href} {...props}>
      {text}
    </Button>
  );
};

export default ButtonLink;
