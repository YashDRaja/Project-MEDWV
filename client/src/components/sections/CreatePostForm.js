import { React, useState, useContext } from "react";
import {useHistory} from 'react-router-dom';
import { Field, Form, Formik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertIcon,
  Textarea,
  Text
} from "@chakra-ui/react";
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext'

export default function CreateAccountForm({
  title,
  ctaText,
  ...rest
}) {

  const [file, setFile] = useState("");
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(true);
  const [imgTypeError, setImgTypeError] = useState(false);
  let history = useHistory();
  const { setAuthState } = useContext(AuthContext);

  const handleShowPass = () => setShowPass(!showPass);

  const handleUpload = (event) => {
    var fileName = document.getElementById("fileName").value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile=="jpg" || extFile=="jpeg" || extFile=="png" || extFile=="gif"){
      setFile(event.target.files[0]);
      setImgTypeError(false);
      setImgError(false);
    } else{
      setImgTypeError(true);
    }
  }

  const validateName = (value) => {
    let error;
    if (!value) {
      error = 'Name is required!';
    } else if (value.length < 2) {
      error = 'Too Short!';
    } else if (value.length > 200) {
      error = 'Too Long!';
    }
    return error;
  }

  const validateAbout = (value) => {
    let error;
    if (!value) {
      error = 'About section is required!';
    } else if (value.length < 2) {
      error = 'Too Short!';
    } else if (value.length > 4000) {
      error = 'Too Long!';
    }
    return error; 
  }

  const validateLocation = (value) => {
    let error;
    if (!value) {
      error = 'Location section is required!';
    } else if (value.length < 2) {
      error = 'Too Short!';
    } else if (value.length > 4000) {
      error = 'Too Long!';
    }
    return error; 
  }

  const validateAdmission = (value) => {
    let error;
    if (!value) {
      error = 'Admission Section is required!';
    } else if (value.length < 2) {
      error = 'Too Short!';
    } else if (value.length > 4000) {
      error = 'Too Long!';
    }
    return error; 
  }

  // const ImageThumb = ({ image }) => {
  //   return <img src={URL.createObjectURL(image)} alt={image.name} />;
  // };

  const handleChange = (event) => setPassword(event.target.value);

  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
        <Box borderRadius="1rem" bg="white" w="100%" p={4} color="primary.300" minW='40vw'>
          <Stack align="center" spacing={4}>
            <Heading
              as="h1"
              size="2xl"
              fontWeight="bold"
              color="primary.400"
              textAlign={["center", "center", "left", "left"]}
            >
              Create Post
            </Heading>

            <Formik
              initialValues={{
                Name: '',
                About: '',
                Location: '',
                Admission: '',
              }}
              onSubmit={(values, actions) => {
                if (!imgError && !imgTypeError) {
                  const data = new FormData()
                  data.append('file', file)
                  data.append('name', values.Name)
                  data.append('about', values.About)
                  data.append('location', values.Location)
                  data.append('admission', values.Admission)
                  axios.post("/api/posts/create", 
                    data, {
                      withCredentials: true,
                      headers: {
                       'Content-Type': 'multipart/form-data'
                     }
                   }
                  ).then((response) => {
                    if (response.data.error) {
                      setError(true);
                    } else {
                      history.push("/")
                    }
                  })
                } else if (imgError) {
                  setError(true);
                }
                actions.setSubmitting(false)

              }}
            >
              {(props) => (
                <Form>
                  <Stack align="center" spacing={4} minW="40vw">
                    {/* <Field name="Image"> */}
                      <Box minW="60vw" id="upload-box">
                      <Text align="left">Images (gif, jpeg, jpg, png):</Text>
                      <input name="image" type="file" id="fileName" accept=".jpg,.jpeg,.gif,.png*" onChange={handleUpload} />

                        {/* <p>Filename: {file.name}</p>
                        <p>File type: {file.type}</p>
                        <p>File size: {file.size} bytes</p> 
                        {file && <ImageThumb image={file} />}*/}
                      </Box>
                    {/* </Field> */}
                    <Field name="Name" validate={validateName}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.Name && form.touched.Name}>
                          <Input {...field} variant="filled" id="Name" placeholder="School Name" />
                          <FormErrorMessage>{form.errors.Name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                     <Field name="About" validate={validateAbout}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.About && form.touched.About}>
                          <Textarea {...field}  variant="filled" id="About" placeholder="About" />
                          <FormErrorMessage>{form.errors.About}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="Location" validate={validateLocation}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.Location && form.touched.Location}>
                          <Textarea {...field} variant="filled" id="Location" placeholder="Location" />
                          <FormErrorMessage>{form.errors.Location}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="Admission" validate={validateAdmission}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.Admission && form.touched.Admission}>
                          <Textarea {...field} variant="filled" id="Admission" placeholder="Admission" />
                          <FormErrorMessage>{form.errors.Admission}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Button
                      mt={4}
                      colorScheme="green"
                      isLoading={props.isSubmitting}
                      type="Sign Up"
                    >
                      Create
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
            {
              error && imgError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Error!</AlertTitle>
                  <AlertDescription>No Image Chosen.</AlertDescription>
                </Alert>
              ) : ''
            }
            {
              imgTypeError ? 
              (
                <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>Only jpg/jpeg, png, or gif files are allowed!.</AlertDescription>
                </Alert>
              ) : ''
            }
          </Stack>
        </Box>
    </Flex>
  );
}