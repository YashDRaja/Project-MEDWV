import { React, useState, useContext } from "react";
import {useHistory, useParams} from 'react-router-dom';
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
  Checkbox,
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
import { useEffect } from "react";
import Posts from "../../pages/Posts";

export default function CreateAccountForm({
  title,
  ctaText,
  ...rest
}) {

  const [file, setFile] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  // const [noImg, setNoImg] = useState(true);
  const [post, setPost] = useState({});
  const [imgTypeError, setImgTypeError] = useState(true);
  const [editForm, setEditForm] = useState([]);
  const [nameValue, setNameValue] = useState("")
  const [aboutValue, setAboutValue] = useState("")
  const [locValue, setLocValue] = useState("")
  const [admValue, setAdmValue] = useState("")
  // const [checked, setChecked] = useState(true);
  let history = useHistory();
  let { id } = useParams();
  // const { setAuthState } = useContext(AuthContext);

  const handleShowPass = () => setShowPass(!showPass);

  const handleUpload = (event) => {
    var fileName = document.getElementById("fileName").value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    console.log(extFile=="jpg" || extFile=="jpeg" || extFile=="png" || extFile=="gif")
    if (extFile=="jpg" || extFile=="jpeg" || extFile=="png" || extFile=="gif"){
     
      // setFile(prevState =>
      //   {return {...prevState, file: event.target.files[0]}}
      //   );
      setFile(event.target.files[0]);

      console.log(file);
    } else{
      // setFile()
      // setFile(prevState =>
      //    {return {...prevState, file: ""}}
      //    );
      alert("Make sure to pick an image and only jpg/jpeg, png, or gif files are allowed!.")
    }
  }

  const validateName = (value) => {
    let error;
    if (!nameValue) {
      error = 'Name is required!';
    } else if (nameValue.length < 2) {
      error = 'Too Short!';
    } else if (nameValue.length > 200) {
      error = 'Too Long!';
    }
    return error;
  }

  const validateAbout = (value) => {
    let error;
    if (!aboutValue) {
      error = 'About section is required!';
    } else if (aboutValue.length < 2) {
      error = 'Too Short!';
    } else if (aboutValue.length > 4000) {
      error = 'Too Long!';
    }
    return error; 
  }

  const validateLocation = (value) => {
    let error;
    if (!locValue) {
      error = 'Location section is required!';
    } else if (locValue.length < 2) {
      error = 'Too Short!';
    } else if (locValue.length > 4000) {
      error = 'Too Long!';
    }
    return error; 
  }

  const validateAdmission = (value) => {
    let error;
    if (!admValue) {
      error = 'Admission Section is required!';
    } else if (admValue.length < 2) {
      error = 'Too Short!';
    } else if (admValue.length > 4000) {
      error = 'Too Long!';
    }
    return error; 
  }

  // const ImageThumb = ({ image }) => {
  //   return <img src={URL.createObjectURL(image)} alt={image.name} />;
  // };
  // const KeepOldImage = () => {
  //   setChecked(!checked);
  //   // console.log(checked);
  // }
  const FormLoad = () => {
    axios.get(`/api/posts/${id}`, { withCredentials: true })
      .then((response) => {
        if (response.data.error) {
          // setLoading(true);
          // setEditForm([
          // <Box align="center" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
          //   Error, No Post Found
          // </Box>
          // ])
          setErrorForm(true);
        } else {
          if (response.data.post.length === 0) {
            // setEditForm([
            //   <Box align="center"borderWidth="1px" borderRadius="lg" bg="#f5ffed">
            //     No Post Found
            //   </Box>
            // ])
            setErrorForm(true);
          } else {
            if (!response.data.edit) {
              console.log("tried");
              history.push(`../post/${id}`)
            }
            
            setPost(response.data.post);
            setNameValue(response.data.post.name)
            setAboutValue(response.data.post.about)
            setLocValue(response.data.post.location)
            setAdmValue(response.data.post.admission)
          }
        }
      }).catch ((e) => {
        console.log(e);
      })
  }

  useEffect(() => {
    FormLoad();
  }, []);


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

            <Stack spacing={4} direction="row" align="center">
                <Text color="#474B4F" fontWeight="bold" fontSize="5xl" pb={4} pt={4}>Update Post</Text>

                <Button colorScheme="red" onClick={() => {
                  history.push(`/post/${id}`)
                }}
                  size="md">
                    Cancel
                </Button>
                
            </Stack>
                { errorForm ? 
                (<Box align="center" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
                   Error, No Post Found
                </Box>) :

                  (<Formik
                  initialValues={{
                    Name: '',
                    About: '',
                    Location: '',
                    Admission: '',
                  }}
                  onSubmit={async (values, actions) => {
                    console.log("here")
                    console.log(imgTypeError);
                    console.log(file);
                    
                      const data = new FormData()
                      console.log(file);
    
                      data.append('file', file)
                      data.append('name', nameValue)
                      data.append('about', aboutValue)
                      data.append('location', locValue)
                      data.append('admission', admValue)
                      console.log("reach")
                      
                      axios.put(`/api/posts/edit/${id}`, 
                        data, {
                          withCredentials: true,
                          headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                        }
                      ).then((response) => {
                        console.log(file)
                        if (response.data.error) {
                          console.log(response.data.error)
                          setImgTypeError(true);
                        } else {
                          console.log("go")
                          console.log(imgTypeError);
                          history.push("/")
                        }
                      }).catch((e) => {
                        console.log(e);
                      })
                      
                      
                    
                    actions.setSubmitting(false)
    
                  }}
                >
                  {(props) => (
                  <Form>
                    <Stack align="center" spacing={4} minW="40vw">
                      {/* <Field name="Image"> */}
                        <Box minW="60vw" id="upload-box">
                        <Text align="left">Images (gif, jpeg, jpg, png), If you would like to keep the same image, do not chose a file:</Text>
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
                            <Input {...field} 
                            value={nameValue}
                            onChange={(e) => {
                             let targetValue = e.target.value;
                             setNameValue(targetValue);
                            }}
                            variant="filled" id="Name" placeholder="School Name" />
                            <FormErrorMessage>{form.errors.Name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="About" validate={validateAbout}>
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.About && form.touched.About}>
                            <Textarea {...field} 
                            value={aboutValue}
                            onChange={(e) => {
                             let targetValue = e.target.value;
                             setAboutValue(targetValue);
                            }}
                            variant="filled" id="About" placeholder="About" />
                            <FormErrorMessage>{form.errors.About}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="Location" validate={validateLocation}>
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.Location && form.touched.Location}>
                            <Textarea {...field} 
                            value={locValue}
                            onChange={(e) => {
                             let targetValue = e.target.value;
                             setLocValue(targetValue);
                            }}
                             variant="filled" id="Location" placeholder="Location" />
                            <FormErrorMessage>{form.errors.Location}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="Admission" validate={validateAdmission}>
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.Admission && form.touched.Admission}>
                            <Textarea {...field} 
                             value={admValue}
                             onChange={(e) => {
                              let targetValue = e.target.value;
                              setAdmValue(targetValue);
                             }}
                            variant="filled" id="Admission" placeholder="Admission" />
                            <FormErrorMessage>{form.errors.Admission}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      {/* <Checkbox defaultIsChecked checked={checked} onChange={KeepOldImage}>Keep Old Image</Checkbox> */}
                      <Button
                        mt={4}
                        colorScheme="green"
                        isLoading={props.isSubmitting}
                        type="Sign Up"
                      >
                        Update
                      </Button>
                    </Stack>
                  </Form>
                  )}
                  </Formik>)
                }
              {/* {editForm} */}
            {/* {
              imgTypeError ? 
              (
                <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>Make sure to pick an image and only jpg/jpeg, png, or gif files are allowed!.</AlertDescription>
                </Alert>
              ) : ''
            } */}
          </Stack>
        </Box>
    </Flex>
  );
}