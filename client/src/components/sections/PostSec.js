import { React, useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Spinner,
  Image,
  StackDivider,
  Stack,
  Button,
  Icon,
  Container,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, Center, HStack,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from 'axios';

export default function PostSec({
  ...rest
}) {
  const [postHistory, setPostHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  let history = useHistory();
  let { id } = useParams();

  const PostsLoad = () => {
    axios.get(`/api/posts/${id}`, { withCredentials: true })
      .then((response) => {
        if (response.data.error) {
          setLoading(true);
          setPostHistory([
          <Box align="center" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
            Error, No Post Found
          </Box>
          ])
        } else {
          setEditable(response.data.edit);
          let posts = [];
          if (response.data.post.length === 0) {
            posts.push(
              <Box align="center"borderWidth="1px" borderRadius="lg" bg="#f5ffed">
                No Post Found
              </Box>
            )
          } else {
            let post = response.data.post;
            posts.push(
              <Box  borderWidth="1px" borderRadius="lg" overflow="hidden">
                <HStack>
              <Image src={"https://project-medwv.s3.amazonaws.com/" + post.image}
                     boxSize="30vw"
                     //  height="10vw"
                    //  width="70vw"
                    />
              <Container align="center" minW="50vw">
              <Text as="h2" fontWeight="semibold">School Name:</Text>
                  <Text mt="1"
                      as="h3"
                      lineHeight="tight"
                      >{post.name}</Text>
                      <br/>
                  <Text>About:</Text>
                  <Text mt="1"
                      as="h3"
                      lineHeight="tight"
                      >{post.about}</Text>
                      <br/>
                      
                  <Text as="h2" >Location:</Text>
                  <Text mt="1"
                      as="h4"
                      lineHeight="tight"
                      >{post.location}</Text>
                      <br/>
                  <Text as="h2">Admission:</Text>
                  <Text mt="1"
                      as="h4"
                      lineHeight="tight"
                      >{post.admission}</Text>
                      <br/>
                </Container>
               </HStack>



               
              </Box>
            )
          }
          console.log(posts);
          setPostHistory(posts);
          setLoading(true);
          console.log(response.data);
        }
      }).catch((e) => {
        console.log(e);
      });
      
  }

  useEffect(() => {
    PostsLoad();
  }, []);


  return (
    <>
      {loading ? (
        <Flex
          align="center"
          justify={{ base: "center", md: "start", xl: "flex-start" }}
          direction={{ base: "column", md: "row" }}
          bg="white"
          borderRadius="2xl"
          px={8}
          pb={8}
          mb={16}
          {...rest}
        >
            <VStack
            divider={<StackDivider borderColor="gray.200" />}
            align="stretch"
            minW="80vw"
            >
              <Stack spacing="65vw" direction="row" align="center">
                <Text color="#474B4F" fontWeight="bold" fontSize="5xl" pb={4} pt={4}>Post</Text>
                {editable ? 
                (

                <Button colorScheme="teal" onClick={() => {
                  history.push(`/edit/${id}`)
                }}
                  
                  size="lg">
                  <Icon as={FaEdit} />&nbsp;Update
                </Button>
                ) : ''}
              </Stack>
                   {postHistory}
            </VStack>
        </Flex>
      ) : (
        <Spinner size="lg" color="white"/>
      )}
    </>
  );
}