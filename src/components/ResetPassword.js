import { useState, useReducer } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Grid, Header, Segment, Modal, Button, Container, Form, Image, Icon } from "semantic-ui-react"
import { useGetUsersQuery, useChangePasswordMutation } from "../features/api/apiSlice"

const initialState = {
    open: false,
    size: undefined
}

function resetReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}

        case 'close':
            return {open: false}

        default:
            return new Error('An error occurred')
    }
}
const ResetPassword = ({mobile}) => {

    const param = useParams()

    const [state, dispatch] = useReducer(resetReducer, initialState)
    
    const {open, size} = state

    const [loading, setloading] = useState(false)

    let emailId = param.email 

    const [user_id, setId] = useState("")

    const {data: users, isSuccess} = useGetUsersQuery()

    if(isSuccess){
        const user = users.filter(u => u.email === emailId)[0]
        if(user){
            setId(user.id)
        }

    }

    const [password, setpassword] = useState("")
    const [resetpassword, setresetpassword] = useState("")

    const [passwordError, setpasswordError] = useState(false)
    const [resetpasswordError, setresetpasswordError] = useState(false)
    
    const navigate = useNavigate()

    const handlePassword = (e) => setpassword(e.target.value)

    const handleresetPassword = (e) => setresetpassword(e.target.value)

   
    const [updatePassword, {isLoading}] = useChangePasswordMutation()

    const savePassword = [user_id, password].every(Boolean) && !isLoading


    const resetBtn = async () => {

        if(password === ''){
            setpasswordError({content: 'Password field is empty', pointing: 'below'})
        }else if(resetpassword === ''){
            setresetpasswordError({content: 'Reset Password field is empty', pointing: 'below'})
        }else{
            if(savePassword){
                setloading(true)
                try{
                    await updatePassword({id: user_id, password}).unwrap()
                    setloading(false)
                    dispatch({type: 'open', size: "mini"})
                }catch(error){
                    console.log("An error has occurred " + error)
                }
            }
            
        }
        
    }
    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 20 : 40}}>
                <Grid textAlign="center" style={{height: mobile ? '60vh' : '60vh'}} verticalAlign="middle">
                    <Grid.Row >
                        <Grid.Column style={{ maxWidth: 450}}>
                            <Form size="big">
                                <Form.Field>
                                    <Form.Input 
                                        placeholder="Password"
                                        type="password" 
                                        value={password}
                                        error={passwordError}
                                        onChange={handlePassword}
                                        onClick={() => setpasswordError(false)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input 
                                        placeholder="Reset Password" 
                                        type="password"
                                        value={resetpassword}
                                        error={resetpasswordError}
                                        onChange={handleresetPassword}
                                        onClick={() => setresetpasswordError(false)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                <Button
                                    size="large"
                                    style={{ color: '#fff', backgroundColor: "#3E72C0"}}
                                    onClick={() => resetBtn()}
                                    loading={loading}
                                >
                                    Reset Password
                                </Button>
                                </Form.Field>      
                            </Form>
                        </Grid.Column>
                    </Grid.Row>              
                </Grid>
                <Modal
                        open={open}
                        size={size}
                    >
                        <Modal.Header>
                            Password Reset
                            <Icon 
                                onClick={() => dispatch({type: 'close'})} 
                                name="close" 
                                size="small" 
                                style={{ float: 'right'}} 
                                link={true}
                            />
                        </Modal.Header>
                        <Modal.Content>
                            <Header icon textAlign="center" as="h4">
                                <Icon 
                                    size="large" 
                                    circular 
                                    inverted 
                                    name="check" 
                                    color="green" 
                                />
                                Your Password has been reset
                            </Header>
                            <Button 
                                color="green"
                                onClick={() => navigate("/signin")}
                            >
                                OK
                            </Button>
                        </Modal.Content>
                    </Modal>
        </Segment>
        </Container>

    )

}
export default ResetPassword