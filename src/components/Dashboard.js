import { Link, useNavigate } from "react-router-dom"
import { Form, Grid, Header, Label, Segment, Icon, Container, Dropdown, Button, Portal, Input, Modal, List, Divider, Card } from "semantic-ui-react"
import { useAcceptMembershipMutation, useDeclineMembershipMutation, useGetMembersQuery } from "../features/api/apiSlice"
import { useEffect, useReducer, useState } from "react"
import { Alarmclock } from './Alarmclock'
import getUsers, { getAlarms, getGroupMembers, getGroups, getGroupUploads } from "../API"

const initialState = {
    open: false,
    size: undefined,
    open_group: false,
    size_group: undefined,
    open_add_member: false,
    size_add_member: undefined,
    open_upload: false,
    size_upload: undefined

} 

function alarmReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}

        case 'open_group':
            return {open_group: true, size_group: action.size_group}

        case 'open_add_member':
            return {open_add_member: true, size_add_member: action.size_add_member}

        case 'open_upload':
            return {open_upload: true, size_upload: action.size_upload}

        case 'close':
            return {open: false}

        case 'close_group':
            return {open_group: false}

        case 'close_add_member':
            return { open_add_member: false}

        case 'close_upload':
            return { open_upload: false}

        default:
            return new Error('An Error has occurred')
    }

}
const Dashboard = ({mobile}) => {

    let pos = 49
    let substr = "fl_attachment/"
                                               
    const [state, dispatch] = useReducer(alarmReducer, initialState)
    const {open, size, open_group, size_group, open_add_member, size_add_member, open_upload, size_upload} = state

    const [groupname, setGroupname] = useState("")

    const [groupmembers, setgroupmembers] = useState([])

    const [groupnameError, setgroupnameError] = useState(false)

    const [membername, setmembername] = useState("")

    const [membernameError, setmembernameError] = useState(false)

    const [groupId, setgroupId] = useState()

    const [group_name, setgroup_name] = useState("")

    const [groups, setGroups] = useState([])

    const [btn_loading, setbtn_Loading] = useState(false)

    const [member_loading, setmember_loading] = useState(false)

    const [name_group, setname_group] = useState("")

    const [id_group, setid_group] = useState("")

    const [alarms, setalarms] = useState([])

    const [fileName, setFileName] = useState(null)

    const [fileNameError, setFileNameError] = useState(false)

    useEffect(() => {
        getAllAlarms()
        getAllGroups()
        getAllusers()
        getAllGroupMembers()
        getAllGroupUploads()
    },[])

    const getAllGroups = () => {
        getGroups().get("/").then(response => setGroups(response.data))
        .catch(error => console.log("An Error has occurred" + error))
    }

    const getAllAlarms = () => {
        getAlarms().get("/")
        .then(response => setalarms(response.data))
    }

    const getAllusers = () => {
        getUsers().get("/").then(response => setgroupmembers(response.data))
    }

    const [groupuploads, setgroupuploads] = useState([])
    const getAllGroupUploads = () => {
        getGroupUploads().get("/").then(response => setgroupuploads(response.data))
    }

    const [allgroupmembers, setallgroupmembers] = useState([])
    const getAllGroupMembers = () => {
        getGroupMembers().get("/").then(response => setallgroupmembers(response.data))
    }

    //const [member_group, setmembergroup] = useState([])
    //let group_members = []
    //allgroupmembers.map(m => {
     //   group_members.push({"group_name": m.group_name})
    //})

    const member_group = allgroupmembers.filter(e => e.membername == sessionStorage.getItem("email"))

    let groupmembers_copy = []
    groupmembers.map((m) => {
        groupmembers_copy.push({
            "key": m.id, 
            "value": m.email,
            'text': m.email
        })
    })

    const navigate = useNavigate()

    const [loading, setloading] = useState(false)

    const [loading1, setloading1] = useState(false)

    const [updateAcceptInvite, {isLoading}] = useAcceptMembershipMutation()

    //const updateAccept = [status].every(Boolean) && !isLoading
    const accept = async (editId) => {
        try{
            let status = "accept"
            setloading(true)
            await updateAcceptInvite({id: editId, status}).unwrap()
            setloading(false)
        }catch(error){
            console.log('An error has occurred ' + error)
        }
    }

    const [updateDeclineInvite] = useDeclineMembershipMutation()

   // const updateDecline = [status].every(Boolean) && !isLoading

    const decline = async (editId) => {
        try{
            let status = "decline"
            setloading1(true)
            await updateDeclineInvite({id: editId, status}).unwrap()
            setloading1(false)
        }catch(error){
            console.log('An error has occurred ' + error)
        }
    }
    
    let count2 = 0
        const currentAlarms = alarms.filter(e => e.email === sessionStorage.getItem("email"))
            currentAlarms.map(alarm => (              
              ++count2
        ))
          

    const {data:members, isSuccess} = useGetMembersQuery()

    let notifications
    let count = 0
    if(isSuccess){
        const current_notifications = members.filter(m => m.memberEmail === sessionStorage.getItem("email"))
        if(current_notifications){
            notifications = current_notifications.map(n => {
                if(n.status === 'pending'){
                    ++count
                    return(
                        <p>
                            1. Pending member request from<br/>
                            <span style={{color: "green"}}> 
                                {n.community_owner}
                            </span>
                            <Button 
                                size="mini" 
                                color="positive"
                                onClick={() => accept(n.id)}
                                loading={loading}
                            >
                                yes
                            </Button>
                            <Button 
                                size="mini" 
                                color="negative"
                                onClick={() => decline(n.id)}
                                loading={loading1}
                            >
                                No
                            </Button>
                        </p>
                    )
                }
            })
        }
    }

    //new Group
    const openGroup = () => {
        dispatch({type: 'open_group', size_group: 'large'})
    }

    const groupOpen = () => {
        if(groupname === ""){
            setgroupnameError({content: "an error has occurred", pointing: "above"})
        }else{
            setbtn_Loading(true)
            let owner = sessionStorage.getItem("email")
            let items = {groupname, owner}
            getGroups().post("/", items).then(() => {
                let group_name = groupname
                let membername = sessionStorage.getItem("email")
                let items = {group_name, membername}
                getGroupMembers().post("/", items)
                .then(() => {
                    setbtn_Loading(false)
                    getAllGroups()
                    setGroupname("")
                })
            })
        }
    }

    const openMember = (id, groupName) => {
        setgroupId(id)
        setgroup_name(groupName)
        dispatch({type: "open_add_member", size_add_member: "mini"})
    }
    
    const addMember = () => {
        if(membername === ""){
            setmembernameError({content: "Empty member name", pointing: "above"})
        }else{
            setmember_loading(true)
            let items = {groupId, group_name, membername}
            getGroupMembers().post("/", items)
            .then(() => {
                setmember_loading(false)
            }).catch(function(error){
                console.log(error.response.message)
            })

        }
    }

    const [view_members, setview_members] = useState([])
    const [group_uploads, setgroup_uploads] = useState([])

    let view = []
    let uploads = []

    const viewMembers = (id, gName) => {
        setname_group(gName)
        setid_group(id)
        getAllGroupMembers()
        allgroupmembers.map(m => {
            if(m.group_name == gName ){
               view.push({"membername": m.membername}) 
            }
        })
        getAllGroupUploads()
        groupuploads.map(g => {
            if(g.name_group == gName){
                uploads.push({"file_name": g.file_name, "file_uploaded": g.file_uploaded})
            }
        })
        setview_members(view)
        setgroup_uploads(uploads)
    }

    const [btn2_loading, setbtn2_loading] = useState(false)

    let file_uploaded
    const uploadFile = async () => {
        if(fileName === ""){
            setFileNameError({content: "Field is required", pointing: "above"})
        }else {
            setbtn2_loading(true)
            let fileURL
            const data = new FormData()
            data.append("file", fileName)
            data.append("upload_preset", "slakw5ml")
            data.append("cloud_name", "du3ck2joa")
            data.append("resource_type", "video")
            data.append("folder", "all_uploads")

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                {
                    method: "POST",
                    body: data,
                }
            )
            const res = await response.json()
            fileURL = res.url.toString()
            file_uploaded = fileURL

            let items = {file_name, file_uploaded, id_group, name_group }
            getGroupUploads().post("/", items).then(() => {
                setbtn2_loading(false)
            })
        }
    }

    //handle File
    const [file_name, setfile_name] = useState("")
    const handleFile = (e) => {
        const file = e.target.files[0]
        setFileName(file)
        setfile_name(file.name)

        const reader = new FileReader()
        reader.readAsDataURL(file)

    }
    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 10 : 40}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={mobile ? 5 : 5} verticalAlign="middle">
                            {/*<Button 
                                color="green"
                                compact
                                size={ mobile ? "mini" : "large"}
                                onClick={() => {
                                    navigate("/community")
                                }
                                }
                            >
                                COMMUNITY
                            </Button>*/}
                            <Button
                                color="green"
                                compact
                                size={ mobile ? "mini" : "large"}
                                onClick={() =>
                                    openGroup()
                                }
                            >
                                New Group
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={mobile ? 4 : 4} textAlign="right" verticalAlign="middle">
                        <Label circular color="red">{count}</Label>

                            <Portal
                                closeOnTriggerClick
                                openOnTriggerClick
                                trigger={
                                    <Icon 
                                        name="bell outline" 
                                        inverted 
                                        color="#fff" 
                                        size= { mobile ? "large" : "big"}
                                    />
                                }
                            
                            >
                                <Segment
                                    style={{
                                        left: mobile ? '25%' : '55%',
                                        position: 'fixed',
                                        top: mobile ? '8%' : '18%',
                                        zIndex: 500,
                                    }}
                                    >
                                    <Header attached>Pending Member Invites</Header>
                                        {notifications}
                                    </Segment>
                            </Portal>
                            
                        </Grid.Column>                          
                        <Grid.Column width={mobile ? 4 : 4} verticalAlign="middle" textAlign="right">
                        <Label circular color="green">{count2}</Label>

                                    <Icon 
                                        name="calendar alternate outline" 
                                        inverted 
                                        color="#fff" 
                                        link={true}
                                        size= { mobile ? "large" : "big"}
                                        onClick={() => dispatch({type: 'open', size: 'mini'})}

                                    />
                            
                        </Grid.Column>
                        <Grid.Column width={mobile ? 3 : 3} style={{textAlign: 'center'}}>
                            <Segment floated="right" vertical style={{ 
                                alignSelf: 'right', 
                                alignContent: 'center',
                                width: 50, 
                                height: 50, 
                                borderRadius: 100,
                                backgroundColor: '#fff'
                            }}>
                                <Dropdown 
                                    text={
                                        sessionStorage.getItem("fname").charAt(0).toUpperCase()
                                        + " " +
                                        sessionStorage.getItem("lname").charAt(0).toUpperCase()
                                    }
                                    inline
                                >
                                  <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => navigate("/support")}>
                                        Support
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate("/signin")}>
                                        Log out
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>   
                    <Grid.Row>
                        <Grid.Column>
                            <Segment vertical style={{backgroundColor: mobile ? '' : '#fff', borderRadius: 10, borderWidth: mobile ? '' : '5px', borderStyle: mobile ? '' : 'solid', borderColor: mobile ? '' : '#7c5353'}}>
                                <Header 
                                    textAlign="center" 
                                    content="MASTA PLANA"
                                    as="h1" 
                                    style={{
                                        fontFamily: 'Spicy Rice',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        color: mobile ? '#fff' : ''
                                    }}
                                />
                            </Segment>
                        </Grid.Column>
                       
                    </Grid.Row>  
                    <Grid.Row>
                        <Grid.Column>
                            <Segment padded vertical style={{paddingTop: mobile ? 10 : 20, paddingBottom: mobile ? 10 : 20, borderRadius: mobile ? 0 : 10, borderWidth: mobile ? '' : '5px', borderStyle: mobile ? '' : 'solid', borderColor: mobile ? '' : '#fff'}}>
                                <Grid textAlign="center" padded>
                                    <Grid.Row>
                                        <Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge"  link={true} onClick={() => navigate("/document")} color="green" name="edit outline" />
                                            <Header as="h4" inverted content="DOCUMENT" />
                                        </Grid.Column>
                                        {/*<Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" color="green" name="ticket" />
                                            <Header as="h4" inverted content="SCAN" />
                                        </Grid.Column> */}
                                        <Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" link={true} onClick={() => navigate("/photos")} color="green" name="image outline" />
                                            <Header as="h4" inverted content="PHOTOS" />
                                        </Grid.Column>
                                        {/*<Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" color="green" name="file alternate outline" />
                                            <Header as="h4" inverted content="DOCUMENT" />
                                        </Grid.Column> */}
                                        <Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" link={true} onClick={() => navigate("/audio")} color="green" name="music" />
                                            <Header as="h4" inverted content="AUDIO" />
                                        </Grid.Column>
                                        <Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" link={true} onClick={() => navigate("/video")} color="green" name="youtube square" />
                                            <Header as="h4" inverted content="VIDEO" />
                                        </Grid.Column>
                                        <Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" link={true} onClick={() => navigate("/data_bank")} color="green" name="database" />
                                            <Header as="h4" inverted content="DATA BANK" />
                                        </Grid.Column>
                                        {/*<Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" link={true} color="green" name="rocketchat" />
                                            <Header as="h4" inverted content="CHART" />
                                        </Grid.Column>*/}
                                        <Grid.Column width={mobile ? 8 : 2} textAlign="center"  onClick={() => navigate("/notice_center")} style={{marginTop: 40}}>
                                            <Icon inverted link={true} size="huge" color="green" name="bell outline" />          
                                            <Header as="h4" inverted content="NOTICE" />
                                        </Grid.Column>
                                        {/*<Grid.Column width={mobile ? 8 : 2} textAlign="center" style={{marginTop: 40}}>
                                            <Icon inverted size="huge" color="green" name="home" />
                                            <Header as="h4" inverted content="OFFICE" />
                                        </Grid.Column>*/}
                                       
                                    </Grid.Row>
                                </Grid>

                            </Segment>
                        </Grid.Column>
                    </Grid.Row> 
                    {/*<Grid.Row>
                        <Grid.Column>
                            <Segment vertical style={{borderRadius: mobile ? 0 : 10, borderWidth: mobile ? '' : '5px', borderStyle: mobile ? '' : 'solid', borderColor: mobile ? '' : '#fff'}}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={mobile ? 8 : 8} textAlign="center">
                                            <Icon inverted size="huge" color="green" name="microphone" />
                                        </Grid.Column>
                                        <Grid.Column width={mobile ? 8 : 8} textAlign="center" >
                                            <Icon  inverted size="huge" color="green" name="rocketchat" />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>       */}    
                </Grid>
                <Modal
                    open={open}
                    size={size}
                >
                    <Modal.Header>
                        <Icon name="bell outline" />
                        Calendar Reminder
                        <Icon 
                            link={true} 
                            name="close" 
                            onClick={() => dispatch({type: 'close'})} 
                            style={{float: 'right'}}
                        />
                    </Modal.Header>
                    <Modal.Content>
                        {/*<Header textAlign="center" as="h3" attached>Calendar Reminder</Header>*/}
                        <Alarmclock />          
                    </Modal.Content>
                </Modal>
                <Modal
                    open={open_group}
                    size={size_group}
                >
                    <Modal.Header>
                        Open Group
                        <Icon
                            name="cancel"
                            link
                            onClick={() => dispatch({type: 'close_group'})}
                            style={{float: "right"}}
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Grid divided stackable >
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <Form>
                                        <Form.Group widths={"equal"}>
                                            <Form.Field>
                                                <Form.Input
                                                    placeholder="New Group"
                                                    value={groupname}
                                                    error={groupnameError}
                                                    onChange={(e) => setGroupname(e.target.value)}
                                                    onClick={() => setgroupnameError(false)}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Button
                                                    onClick={groupOpen}
                                                    color="green"
                                                    loading={btn_loading}
                                                >
                                                    Create
                                                </Button>
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                    <Header
                                        content="Groups"
                                    />
                                    <List selection divided verticalAlign="middle">
                                        {
                                            member_group.map((m) => (
                                                <List.Item>
                                                    {m.group_name}
                                                    <Dropdown style={{float: "right"}} text='' icon="ellipsis vertical">
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item icon="add" text='Add' onClick={() => openMember(m.id, m.group_name)} />
                                                            <Dropdown.Item icon="eye" text='View' onClick={() => viewMembers(m.id, m.group_name)} />

                                                            {/*<Dropdown.Item icon="trash" text='Delete' />*/}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
    
                                                </List.Item>

                                            ))
                                        }
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Header
                                        content={"Group Mambers  " + name_group}
                                    />
                                    <Divider />
                                    <List relaxed divided>
                                    {view_members.map(v => (
                                        
                                        <List.Item>
                                            {v.membername}
                                        </List.Item>                                        
                                    ))}
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Grid verticalAlign="middle">
                                    <Grid.Row>
                                        <Grid.Column width={8}>
                                            <Header
                                               content={"Uploads"} 
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            {
                                            name_group ? 
                                            <Button onClick={() => dispatch({type: "open_upload", size_upload: "mini"})} style={{float: "right"}} icon color="green" size="tiny">
                                                <Icon name="upload" />
                                                Upload
                                            </Button> : ''
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Card.Group itemsPerRow={2}>
                                            {
                                                  group_uploads.map(m => (
                                                    <Card raised>
                                                        <Card.Content>
                                                            <Card.Header>
                                                                <Dropdown style={{float: "right"}}>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item>
                                                                            <Icon name="download" />
                                                                            <Link to={[m.file_uploaded.slice(0, pos), substr, m.file_uploaded.slice(pos)].join('')}>
                                                                                Download
                                                                            </Link>
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </Card.Header>
                                                            <Card.Meta></Card.Meta>
                                                            <Card.Description>
                                                                <Icon
                                                                    name="file"
                                                                    color="green"
                                                                />
                                                                {m.file_name}
                                                            </Card.Description>
                                                        </Card.Content>
                                                    </Card>
                                                ))
                                            }
                                            </Card.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                    
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                </Modal>
                <Modal
                    open={open_add_member}
                    size={size_add_member}
                >
                    <Modal.Header>
                        Add Member
                        <Icon
                            style={{float: "right"}}
                            name="cancel"
                            onClick={() => dispatch({type: 'close_add_member'})}
                            link
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Form>
                                        <Form.Group>
                                            <Form.Field>
                                                <Dropdown
                                                    placeholder="Member Name"
                                                    search
                                                    value={membername}
                                                    selection
                                                    options={groupmembers_copy}
                                                    onChange={(e, {value}) => setmembername(value)}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                            <Button 
                                                onClick={addMember} 
                                                color="green"
                                                loading={member_loading}
                                            >
                                                +
                                            </Button>
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                </Modal>
                <Modal
                    open={open_upload}
                    size={size_upload}
                >
                    <Modal.Header>
                        Upload File
                        <Icon link style={{float: "right"}} name="close" onClick={() => dispatch({type: "close_upload"})} />
                    </Modal.Header>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                     <Form>
                                    <Form.Input
                                        fluid
                                        placeholder="File Name"
                                        type="file"
                                        onChange={handleFile}
                                        error={fileNameError}
                                        onClick={() => setFileNameError(false)}
                                    />
                               
                                    <Button loading={btn2_loading} color="green" onClick={uploadFile}>
                                        Upload
                                    </Button>
                            </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                       
                    </Modal.Content>
                </Modal>
        </Segment>
        </Container>

    )

}
export default Dashboard