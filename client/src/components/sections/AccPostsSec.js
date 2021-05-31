import { React, useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Spinner,
  Image,
  StackDivider,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, Center, HStack, Container,
} from "@chakra-ui/react";
import axios from 'axios';
import { useHistory } from "react-router-dom";

export default function PostSection({
  ...rest
}) {
  const [postHistory, setPostHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  const PostsLoad = () => {
    axios.get('/api/posts/account-posts', { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        if (response.data.error) {
          setLoading(true);
          setPostHistory([
          <Box align="center" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
            Error
          </Box>
          ])
        } else {
          let posts = [];
          if (response.data.length === 0) {
            posts.push(
              <Box align="center"borderWidth="1px" borderRadius="lg" bg="#f5ffed">
                No posts
              </Box>
            )
          } else {
            let count = 0;
            let postsData = response.data.reverse();
            posts = postsData.map((post) => {
              count++;

              return (
                <Box onClick={() => {
                  history.push(`/post/${post.id}`)
                }}>
                <Box  borderWidth="1px" borderRadius="lg">
                  <HStack>
                <Image src={"https://project-medwv.s3.amazonaws.com/" + post.image}
                       boxSize="20vw"
                       //  height="10vw"
                      //  width="70vw"
                      />
                <Container minW="55vw" align="center">
                 <Text as="h2" fontWeight="semibold">School Name:</Text>
                  <Text mt="1"
                      as="h3"
                      lineHeight="tight"
                      isTruncated>{post.name}</Text>
                      <br/>
                  <Text as="h2" >Location:</Text>
                  <Text mt="1"
                      as="h4"
                      lineHeight="tight"
                      isTruncated>{post.location}</Text>
                      <br/>
                  <Text as="h2">Admission:</Text>
                  <Text mt="1"
                      as="h4"
                      lineHeight="tight"
                      isTruncated>{post.admission}</Text>
                      <br/>
                  <Text
                    mt="1"
                    fontWeight="bold"> View More</Text>
                </Container>
                
                 </HStack>
                </Box>
                </Box>
              )
            })
          }
          
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
            minW="75vw"
            >
                <Text color="#474B4F" align="center" fontWeight="bold" fontSize="5xl" pb={4} pt={4}>Posts</Text>
                  {postHistory}
            </VStack>
        </Flex>
      ) : (
        <Spinner size="lg" color="white"/>
      )}
    </>
  );
}