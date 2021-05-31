import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function Logo(props) {
  return (
    <Box {...props}>
      <Text fontSize="x-large" fontWeight="bold">
        Project MEDWV
      </Text>
    </Box>
  );
}
