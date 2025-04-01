import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Grid, Header, Segment, Button, Container, Form, Image, Icon } from "semantic-ui-react"
 
const ForgotPassword = ({mobile}) => {

    const [email, setemail] = useState("")
    
    const navigate = useNavigate()

    const handleEmail = (e) => setemail(e.target.value)
   

    const loginBtn = () => {

        if(email === ''){
        }else{
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
                                    />
                                </Form.Field>
                                <Form.Field>
                                <Button
                                    size="large"
                                    style={{ color: '#fff', backgroundColor: "#3E72C0"}}
                                    onClick={() => loginBtn()}
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
                </Grid>
        </Segment>
        </Container>

    )

}
export default ForgotPassword