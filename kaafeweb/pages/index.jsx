import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { Box, Card, CardBody, Container, Flex, Heading, Input, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";

export default function Home() {
  const address = useAddress(); // stores the address of the connected wallets to your web aap. 

  const contractAddress = "0x218eb293669e3d8B9ff9d1707193206FfD4C1b18"

  const {contract} = useContract(contractAddress); // this is basically using the contract address to perform the functions of the contract instead of using a abi; 

  const {data: totalCoffees, isLoading: laodingTotalcoffees} = useContractRead(contract , "getTotalCoffee");
  const {data: recentCoffees, isLoading: loadingRecentCoffes } = useContractRead(contract, "getAllCoffee")

  const [name , setName] = useState("");
  const [message , setMessage] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleMessageChange = (event) =>{
    setMessage(event.target.value)
  }

  const clearValues  = () =>{
    setName("");
    setMessage("");
  }



  return (
    <Container maxW={"1200px"} w={"full"}>

      <Flex justifyContent={"space-between"} alignItems={"center"} py={"20px"} height={"80px"}>

        <Box>
          <Text fontWeight={"bold"}> Buy Me A Coffee</Text>
        </Box>

        <ConnectWallet/>
      </Flex>

      
       <SimpleGrid columns={2} spacing={10} mt={"40px"}>
        
        {/* leftSide Box  */}
        <Box>
          <Card>
            <CardBody>
              {/* heading for the left Comlum  */}
              <Heading mb={"20px"}> Buy me a Coffee</Heading>
              
              {/* Showing the total number of coffees received */}
              <Flex direction={"row"}>
                <Text>Total Coffees: </Text>

                <Skeleton  isLoaded={!laodingTotalcoffees} width={"20px"} ml={"5px"}>
                  {totalCoffees?.toString()}
                </Skeleton>

              </Flex>

              <Text fontSize={"2xl"} py={"10px"}> Name: </Text>
              <Input placeholder="Shakti Dubey" maxLength={16} value={name} onChange={handleNameChange}/>

              <Text fontSize={"2xl"} py={"10px"}> Message: </Text>
              <Input placeholder="Hello World" maxLength={16} value={message} onChange={handleMessageChange}/>

              {/* Calling the buyCoffee from the contract  */}
              <Box mt={"20px"}>

                {/* this will check (address) then show buy a cofee / (!address) then shows the text  */}
                {address ? (
                  <Web3Button
                  contractAddress={contractAddress}
                  action={(contract) => {
                    contract.call("buyCoffee", [name, message], {value: ethers.utils.parseEther("0.01")})
                  }} onSuccess={() => clearValues()}
                  >{"Buy a coffee 0.01ETH"}</Web3Button>
                  ) : (
                    <Text>Please Connect Your Wallet</Text>
                  )
                }
                
              </Box>
              
            </CardBody>
          </Card>
        </Box>

        {/* rightSide Box  */}
        <Box>
          <Card maxH={"60vh"} overflow={"scroll"}>
            <CardBody>
              <Text fontWeight={"bold"}>Recent Messages:</Text>

              {/* This will load the recentCoffees that i got.  */}
              {!loadingRecentCoffes ? (
                <Box>
                  {/* This will first check if there are any recent coffees and then it will map and log all of it out. and the reverse it in the order of of latest */}
                  {recentCoffees && recentCoffees.map((coffee, index)=> {
                    return (
                      <Card key={index} my={"10px"}>
                        <CardBody>
                          <Text fontSize={"2xl"}>{coffee[1]}</Text>
                          <Text>From: {coffee[2]}</Text>
                          <Text fontSize={"md"}>Address: {coffee[0]}</Text>
                        </CardBody>
                      </Card>
                    )             
                  }).reverse()}
                </Box>
              ):(
                <Stack>
                  <Skeleton height={"100px"}></Skeleton>
                  <Skeleton height={"100px"}></Skeleton>
                  <Skeleton height={"100px"}></Skeleton>                  
                </Stack>
              )}

            </CardBody>
          </Card>
        </Box>
       </SimpleGrid>
    </Container>
  );
}
