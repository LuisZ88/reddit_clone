import { Button, Flex } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../../../firebase/clientApp';
import AuthModal from '../../Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';


type RightContentProps = {
    user:any;
};

const RightContent:React.FC<RightContentProps> = ({user}) => {
    
    
    return (<>
   <AuthModal/>
    <Flex justify="center" align="center">
        {user ? <div className=""><Button onClick={()=> signOut(auth)}>Logout</Button>{user.email}</div> :<AuthButtons/>}
    </Flex>
    </>)
}
export default RightContent;