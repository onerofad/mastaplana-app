import { useState, useEffect, useReducer } from "react"
import { Modal, Grid, Input, Icon, Table, Header, Button, Dropdown, List } from "semantic-ui-react"
import {useDeleteTableMutation, useGetTablesQuery, useTabularDataMutation} from "../features/api/apiSlice"

    const TableModal = ({openModalTable, sizeModalTable, closeModal}) => {
        
        const [msg, setmsg] = useState("")

        const [title, setTitle] = useState("")

        const [emailId, setemailId] = useState(sessionStorage.getItem("email"))

        const [check, setcheck] = useState("")

        const [head1, sethead1] = useState("Head-1")
        const [head2, sethead2] = useState("Head-2")
        const [head3, sethead3] = useState("Head-3")
        const [head4, sethead4] = useState("Head-4")

        const handlehead1 = (e) => sethead1(e.target.value)
        const handlehead2 = (e) => sethead2(e.target.value)
        const handlehead3 = (e) => sethead3(e.target.value)
        const handlehead4 = (e) => sethead4(e.target.value)

        const [loading, setloading] = useState(false)

        const [value11, setValue11] = useState("")
        const [value12, setValue12] = useState("")
        const [value13, setValue13] = useState("")
        const [value14, setValue14] = useState("")

        const [value21, setValue21] = useState("data")
        const [value22, setValue22] = useState("data")
        const [value23, setValue23] = useState("data")
        const [value24, setValue24] = useState("data")

        const [value31, setValue31] = useState("data")
        const [value32, setValue32] = useState("data")
        const [value33, setValue33] = useState("data")
        const [value34, setValue34] = useState("data")

        const [value41, setValue41] = useState("data")
        const [value42, setValue42] = useState("data")
        const [value43, setValue43] = useState("data")
        const [value44, setValue44] = useState("data")

        const [sendData, {isLoading}] = useTabularDataMutation()

        const saveData = [title, emailId, head1, head2, head3, head4, value11, value12, value13, value14].every(Boolean) && !isLoading

        const saveTable = async () => {
            if(title === '' ||  head1 ==='' ||  head2 === '' || head3 === '' || head4 === '' || value11 === '' || value12 === '' || value13 === '' || value14 === ''){
                setmsg("Please enter title, headers and at least a row")
            }else{
                if(saveData){
                    try{
                        setloading(true)
                        await sendData({
                            title, emailId,
                            head1, head2, head3, head4,
                            value11, value12, value13, value14,
                            value21, value22, value23, value24,
                            value31, value32, value33, value34,
                            value41, value42, value43, value44
                        }).unwrap()
                        setloading(false)
                        setcheck("check")
                        refetch()
                    }catch(error){
                        console.log('An error has occurred' + error)
                    }
                }
            }
        }  

        const {data: tables, isSuccess, refetch} = useGetTablesQuery()

        let tableList
        if(isSuccess){
                const table = tables.filter(t => t.emailId === sessionStorage.getItem("email"))
                tableList = table.map(t => (
                    <List.Item>
                        <List.Content floated="right">
                            <Dropdown simple icon="ellipsis vertical" style={{float: 'right'}}>
                                <Dropdown.Menu>
                                    <Dropdown.Item text="open" icon="save"
                                        onClick={() => openTable()}
                                    />
                                    <Dropdown.Item text="Delete" icon="trash"
                                        onClick={() => deleteTable(t.id)}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                        <List.Icon name="file" size="large" verticalAlign="middle" color="green" />
                        {
                            (t.title.length <= 18) ?
                                <List.Content>
                                    <List.Header>{t.title}</List.Header>
                                </List.Content>
                            :
                                <List.Content>
                                    <List.Header>{t.title.substr(0, 18)}...</List.Header>
                                </List.Content>
                        }
                    </List.Item>   
                ))
            }

        const openTable = () => {

        }

        const [removeTable] = useDeleteTableMutation()

        const deleteTable = async (id) => {
            try{
                await removeTable(id).unwrap()
                refetch()
            }catch(error){

            }
        }

        return(
            <Modal
                open={openModalTable}
                size={sizeModalTable}
            >
                <Modal.Header>
                    Table Data
                    <Icon 
                        link={true} 
                        style={{float: 'right'}} 
                        name="close" 
                        size="small" 
                        onClick={() => closeModal()}
                    />
                    {/*
                    <Icon link={true} style={{float: 'right'}} name="close" onClick={() => closeModal()} />
                    */}
                </Modal.Header>
                    <Modal.Content>
                        <Grid stackable divided> 
                            <Grid.Row>
                                <Grid.Column width={10}>
                                    Table Name
                                    <Input
                                        placeholder="Table Name"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <br/>
                                    {/*<Header content="Edit Table" />*/}
                                    <div style={{maxHeight: 200, overflowY: 'auto'}}>
                                    <Table fixed celled unstackable>
                                        <Table.Header>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head1}
                                                    onChange={handlehead1}                                     
                                                />
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head2}
                                                    onChange={handlehead2}                   
                                                />
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head3}
                                                    onChange={handlehead3}                                
                                                />
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head4}
                                                    onChange={handlehead4}     
                                                />
                                            </Table.HeaderCell>
                                        </Table.Header>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue11(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue12(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue13(e.target.value)}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue14(e.target.value)}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue21(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue22(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue23(e.target.value)}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue24(e.target.value)}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue31(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue32(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue33(e.target.value)}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue34(e.target.value)}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue41(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue42(e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue43(e.target.value)}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue44(e.target.value)}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>             
                                    </div>
                                    <br/>
                                    <Button 
                                        color="green" 
                                        size="large"
                                        loading={loading}
                                        onClick={() => saveTable()}
                                        icon
                                    >
                                        {
                                            (check ?
                                                <>
                                                <Icon name="check" />
                                                Save Data
                                                </>
                                                :
                                                <>
                                                Save Data
                                                </>
                                            )
                                        }
                                    </Button>
                                    <span style={{color: 'red'}}>{msg}</span>
                                   
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <Header textAlign="center" dividing content="Saved Tables" />   
                                        <List selection relaxed="very" divided verticalAlign="middle">
                                            {tableList}
                                        </List>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>

            </Modal>
        )

    }
    export default TableModal
