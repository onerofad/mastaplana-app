import { useState, useEffect, useReducer } from "react"
import { Modal, Grid, Input, Icon, Table, Header, Button, Dropdown, List, Segment, Card, TableHeader } from "semantic-ui-react"
import {useDeleteTableMutation, useEditTableMutation, useGetTablesQuery, useTabularDataMutation} from "../features/api/apiSlice"

    const TableModal = ({openModalTable, sizeModalTable, closeModal}) => {
        
        const [msg, setmsg] = useState("")

        const [id, setId] = useState("")

        const [edit_table, setedit_table] = useState(false)

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

        const [value21, setValue21] = useState("-")
        const [value22, setValue22] = useState("-")
        const [value23, setValue23] = useState("-")
        const [value24, setValue24] = useState("-")

        const [value31, setValue31] = useState("-")
        const [value32, setValue32] = useState("-")
        const [value33, setValue33] = useState("-")
        const [value34, setValue34] = useState("-")

        const [value41, setValue41] = useState("-")
        const [value42, setValue42] = useState("-")
        const [value43, setValue43] = useState("-")
        const [value44, setValue44] = useState("-")

        const [sendData, {isLoading}] = useTabularDataMutation()

        const saveData = [title, emailId, head1, head2, head3, head4, value11, value12, value13, value14].every(Boolean) && !isLoading

        const saveTable = async () => {
            if(title === '' ||  head1 ==='' ||  head2 === '' || head3 === '' || head4 === '' || value11 === '' || value12 === '' || value13 === '' || value14 === ''){
                setmsg("Please enter Table Name, headers and at least a row")
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
                <Grid.Column mobile={16} computer={8}>
                <Card onClick={() => editTable(t.id)} fluid raised link={true}>
                    <Card.Header>
                        {t.title}
                    </Card.Header>
                    <Card.Content>
                        <Table fixed compact size="small" celled unstackable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        {t.head1}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        {t.head2}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        {t.head3}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        {t.head4}
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{t.value11}</Table.Cell>
                                    <Table.Cell>{t.value12}</Table.Cell>
                                    <Table.Cell>{t.value13}</Table.Cell>
                                    <Table.Cell>{t.value14}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>{t.value21}</Table.Cell>
                                    <Table.Cell>{t.value22}</Table.Cell>
                                    <Table.Cell>{t.value23}</Table.Cell>
                                    <Table.Cell>{t.value24}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Card.Content>
                </Card>
                <br/>
                </Grid.Column>
            ))
        }
        
        const editTable = (id) => {
            const tableData = tables.filter(t => t.id === id)[0]
                if(tableData){
                    setId(id)
                    
                    setedit_table(true)

                    setTitle(tableData.title)

                    sethead1(tableData.head1)
                    sethead2(tableData.head2)
                    sethead3(tableData.head3)
                    sethead4(tableData.head4)

                    setValue11(tableData.value11)
                    setValue12(tableData.value12)
                    setValue13(tableData.value13)
                    setValue14(tableData.value14)

                    setValue21(tableData.value21)
                    setValue22(tableData.value22)
                    setValue23(tableData.value23)
                    setValue24(tableData.value24)

                    setValue31(tableData.value31)
                    setValue32(tableData.value32)
                    setValue33(tableData.value33)
                    setValue34(tableData.value34)

                    setValue41(tableData.value41)
                    setValue42(tableData.value42)
                    setValue43(tableData.value43)
                    setValue44(tableData.value44)
                }
            }

        const [editData] = useEditTableMutation()

        const updateData = [title, emailId, head1, head2, head3, head4, value11, value12, value13, value14].every(Boolean) && !isLoading
    
        const updateTable = async () => {
            if(title === '' ||  head1 ==='' ||  head2 === '' || head3 === '' || head4 === '' || value11 === '' || value12 === '' || value13 === '' || value14 === ''){
                setmsg("Please enter Table Name, headers and at least a row")
            }else{
                if(updateData){
                    try{
                        setloading(true)
                        await editData({id: id,
                            title, emailId,
                            head1, head2, head3, head4,
                            value11, value12, value13, value14,
                            value21, value22, value23, value24,
                            value31, value32, value33, value34,
                            value41, value42, value43, value44
                        }).unwrap()
                        setloading(false)
                        setedit_table(false)

                        setTitle("")

                        sethead1("Head-1")
                        sethead2("Head-2")
                        sethead3("Head-3")
                        sethead4("Head-4")

                        setValue11("")
                        setValue12("")
                        setValue13("")
                        setValue14("")

                        setValue21("-")
                        setValue22("-")
                        setValue23("-")
                        setValue24("-")

                        setValue31("-")
                        setValue32("-")
                        setValue33("-")
                        setValue34("-")

                        setValue41("-")
                        setValue42("-")
                        setValue43("-")
                        setValue44("-")

                        refetch()
                    }catch(error){
                        console.log('An error has occurred' + error)
                    }
                }
            }

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
                        style={{float: 'right', verticalAlign: 'middle'}} 
                        name="close" 
                        size="small" 
                        onClick={() => closeModal()}
                    />
                   
                </Modal.Header>
                    <Modal.Content>
                        <Grid stackable divided> 
                            <Grid.Row>
                                <Grid.Column width={6}>   
                                    {/*<Header content="Edit Table" />*/}
                                    Table Name
                                    <Input
                                        placeholder="Table Name"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div style={{overflowY: 'auto'}}>
                                        <br/>
                                    <Table fixed compact size="small" basic celled unstackable>
                                        <Table.Header>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head1}
                                                    onChange={handlehead1} 
                                                    transparent                                    
                                                />
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head2}
                                                    onChange={handlehead2} 
                                                    transparent                  
                                                />
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head3}
                                                    onChange={handlehead3} 
                                                    transparent                               
                                                />
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Input 
                                                    value={head4}
                                                    onChange={handlehead4}
                                                    transparent     
                                                />
                                            </Table.HeaderCell>
                                        </Table.Header>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue11(e.target.value)}
                                                        transparent
                                                        value={value11}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue12(e.target.value)}
                                                        transparent
                                                        value={value12}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue13(e.target.value)}
                                                        transparent
                                                        value={value13}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue14(e.target.value)}
                                                        transparent
                                                        value={value14}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue21(e.target.value)}
                                                        transparent
                                                        value={value21}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue22(e.target.value)}
                                                        transparent
                                                        value={value22}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue23(e.target.value)}
                                                        transparent
                                                        value={value23}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue24(e.target.value)}
                                                        transparent
                                                        value={value24}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue31(e.target.value)}
                                                        transparent
                                                        value={value31}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue32(e.target.value)}
                                                        transparent
                                                        value={value32}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue33(e.target.value)}
                                                        transparent
                                                        value={value33}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue34(e.target.value)}
                                                        transparent
                                                        value={value34}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue41(e.target.value)}
                                                        transparent
                                                        value={value41}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue42(e.target.value)}
                                                        transparent
                                                        value={value42}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue43(e.target.value)}
                                                        transparent
                                                        value={value43}
                                                    /> 
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input 
                                                        onChange={(e) => setValue44(e.target.value)}
                                                        transparent
                                                        value={value44}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>             
                                    </div>
                                    <br/>
                                    {
                                    (edit_table ? 
                                    <Button
                                        color="green"
                                        size="large"
                                        loading={loading}
                                        onClick={() => updateTable()}
                                        icon
                                    >
                                        Edit Data
                                    </Button>
                                    :
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
                                    )
                                    }
                                    <span style={{color: 'red'}}>{msg}</span>
                                   
                                   </Grid.Column>
                                   <Grid.Column width={10}>
                                    {/*<Header textAlign="center" dividing content="Saved Tables" />   
                                        <List selection relaxed="very" divided verticalAlign="middle">
                                            {tableList}
                                        </List>*/}
                                    <Segment style={{height: 300, overflowY: 'auto'}}>
                                        <Grid>
                                            <Grid.Row>
                                                {tableList}          
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>

            </Modal>
        )

    }
    export default TableModal
