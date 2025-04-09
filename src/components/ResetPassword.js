import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Grid, Header, Segment, Button, Container, Form, Image, Icon } from "semantic-ui-react"
 
const ResetPassword = ({mobile}) => {

    const [password, setpassword] = useState("")
    const [resetpassword, setresetpassword] = useState("")

    const [passwordError, setpasswordError] = useState(false)
    const [resetpasswordError, setresetpasswordError] = useState(false)
    
    const navigate = useNavigate()

    const handlePassword = (e) => setpassword(e.target.value)

    const handleresetPassword = (e) => setresetpassword(e.target.value)

   

    const resetBtn = () => {

        if(password === ''){
            setpasswordError({content: 'Password field is empty', pointing: 'below'})
        }else if(resetpassword === ''){
            setresetpasswordError({content: 'Reset Password field is empty', pointing: 'below'})
        }else{

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
                                >
                                    Reset Password
                                </Button>
                                </Form.Field>      
                            </Form>
                        </Grid.Column>
                    </Grid.Row>              
                </Grid>
        </Segment>
        </Container>

    )

}
export default ResetPassword