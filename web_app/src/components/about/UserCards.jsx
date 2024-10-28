import React from 'react';
import { Text, Flex, Image, Link } from '@chakra-ui/react';
import { TEAM } from '@/config/constants/constants.about';

const UserCard = ({
  image = '',
  title = '',
  sub_title = '',
  text = '',
  links = [],
}) => {
  if (!image || !title) return null;
  const renderLinks =
    links &&
    links.map((item, key) => (
      <Link
        fontSize='xs'
        key={key}
        href={item.is_mail ? `mailto:${item.link}` : item.link}
        isExternal={true}
        textDecoration='underline'
        _hover={{
          color: 'blue.800',
        }}
      >
        {item.text}
      </Link>
    ));
  return (
    <Flex
      direction='column'
      alignItems='center'
      textAlign='center'
      p={4}
      bg='transparent'
      color='gray.600'
      w={{ base: '100%', md: '30%' }}
    >
      <Image
        src={image}
        boxSize='100px'
        mb={3}
        color='blue.900'
        borderRadius='full'
      />
      <Text fontSize='md' fontWeight='bold' textTransform='uppercase' m={1}>
        {title}
      </Text>
      <Text fontSize='sm' fontWeight='bold' textTransform='uppercase' m={1}>
        {sub_title}
      </Text>
      <Text fontSize='sm' color='gray.600' textAlign='start'>
        {text}
      </Text>
      <Flex
        flexDirection='row'
        alignItems='start'
        gap={2}
        w='100%'
        flexWrap='wrap'
        mt={2}
      >
        {renderLinks}
      </Flex>
    </Flex>
  );
};

const UserCards = () => {
  const renderCards =
    TEAM && TEAM.map((item, k) => <UserCard key={k} {...item} />);
  return (
    <Flex justifyContent='center' wrap='wrap' p={4} w='100%' border='initial'>
      {renderCards}
    </Flex>
  );
};

export default UserCards;
