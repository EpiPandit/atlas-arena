import { Link } from '@chakra-ui/next-js';

const CustomLink = ({ href, text }) => {
  return (
    <Link href={href} color='blue.500'>
      {text}
    </Link>
  );
};

export default CustomLink;
