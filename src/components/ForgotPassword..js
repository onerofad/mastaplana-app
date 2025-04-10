import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useReducer } from "react"
import { Grid, Header, Segment, Button, Container, Form, Image, Icon, Modal } from "semantic-ui-react"
import emailjs from '@emailjs/browser'
import { useGetUsersQuery } from "../features/api/apiSlice"

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

const ForgotPassword = ({mobile}) => {

    const {data: users, isSuccess} = useGetUsersQuery()

    const [state, dispatch] = useReducer(resetReducer, initialState)
    
    const {open, size} = state

    const [loading, setloading] = useState(false)
    const [email, setemail] = useState("")
    const [emailError, setemailerror] = useState(false)
    
    const navigate = useNavigate()

    const handleEmail = (e) => setemail(e.target.value)
   

    const forgotBtn = () => {
        if(email === ''){
            setemailerror({content: 'Email field is empty', pointing: 'below'})
        }else{
            const user = users.filter(u => u.email === email)[0]
            if(!user){
                setemailerror({content: 'Email does not exist', pointing: 'below'})
            }else{
                setloading(true)
                setTimeout(() => {
                    emailjs.send("service_wo28vkf","template_lq4shvd",{
                        message: `https://mastaplana-app.vercel.app/resetpassword/${email}`,
                        to_email: email,
                    },  {publicKey: '76FU_4OL25685iLZx'});
    
                    dispatch({type: 'open', size: 'mini'})

                },[3000])
                setloading(false)
               
            }
        }
        
    }
    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 20 : 40}}>
                <Grid textAlign="center" style={{height: mobile ? '60vh' : '60vh'}} verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column textAlign="right" verticalAlign="middle">
                            <Link style={{ fontSize: 20, color: '#fff'}} to="/send_file">
                                <Icon inverted name="angle left" color="green" size={mobile ? 'large' : 'big'} />
                                    Send File
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                        <Grid.Column style={{ maxWidth: 450}}>
                            <Form size="big">
                                <Form.Field>
                                    <Form.Input placeholder="Email Address" 
                                        value={email}
                                        error={emailError}
                                        onChange={handleEmail}
                                        onClick={() => setemailerror(false)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                <Button
                                    size="large"
                                    style={{ color: '#fff', backgroundColor: "#3E72C0"}}
                                    onClick={() => forgotBtn()}
                                >
                                    SEND
                                </Button>
                                <Link to="/signin" 
                                    style={{ marginLeft: 10, color: '#fff'}}>
                                    Sign in
                                </Link>
                                </Form.Field>      
                            </Form>
                        </Grid.Column>
                    </Grid.Row> 
                    <Modal
                        open={open}
                        size={size}
                    >
                        <Modal.Header>
                            Message Sent
                            <Icon 
                                onClick={() => dispatch({type: 'close'})} 
                                name="close" 
                                size="small" 
                                style={{ float: 'right'}} 
                                link={true}
                            />
                        </Modal.Header>
                        <Modal.Content>
                            <Header textAlign="center" as="h4">
                                <Icon circular inverted name="check" color="green" />
                                <Header.Subheader>
                                    Visit your email to Reset your password
                                </Header.Subheader>
                            </Header>
                        </Modal.Content>
                    </Modal>             
                </Grid>
        </Segment>
        </Container>

    )

}
export default ForgotPassword