import React, { Component, useState } from 'react'
import { Layout, Button, Form, Input, DatePicker, TimePicker, Divider, Row, Col, Card, List, Modal, Checkbox, Select } from 'antd';
import { render } from '@testing-library/react';
import moment, {Moment} from 'moment';
import {MaskedInput} from 'antd-mask-input'
import Item from 'antd/lib/list/Item';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { generateReport } from './service';
import Cookies from 'universal-cookie';
import { format } from 'path';

interface IProps {
}

export interface IItem {
    itemDescription: string;
    itemValue: number;
}

export interface IClausule {
    description: string;
}

interface IState {
    visible?: boolean;
    valorIgual?: boolean;
    contractorName: string;
    contractorCpf: string;
    endHour: Moment | null;
    eventAddress: string;
    eventCityState: string;
    eventDate: Moment | null;
    eventLocation: string;
    eventNeighborhood: string
    observation: string;
    totalValue: number;
    beginHour: Moment | null;
    ceremonyHour: Moment | null;
    clauses: Array<IClausule>;
    itens: Array<IItem>;
    itemDescription: string,
    itemValue: number

}

const cookies = new Cookies();

export default class Main extends Component<IProps, IState> {

    
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            valorIgual: true,
            contractorName: '',
            contractorCpf: '',
            endHour: moment(),
            eventAddress: '',
            eventCityState: '',
            eventDate: moment(),
            eventLocation: '',
            eventNeighborhood: '',
            observation: '',
            totalValue: 0,
            beginHour: moment(),
            ceremonyHour: moment(),
            clauses: [],
            itens: [],

            itemDescription: '',
            itemValue: 0
        }

        if (cookies.get('default-clauses') === undefined) {
            cookies.set('default-clauses', [
                {description: 'O Evento mencionado será realizado na data e horário combinado, em local fornecido pelo contratante conforme descrito no anverso.'},
                {description: 'A contratada não será responsabilizada por quaisquer dados ocasionados por caso fortuito ou força que possam prejudicar o evento, tais como falta de energia elétrica, tempestades, etc.'},
                {description: 'Será responsabilidade do contratante, qualquer dano causado aos equipamentos de diversão locados, ou dano físico aos usuários, relativo ao mau uso dos equipamentos, por ato de ma fé ou de vandalismo que seus convidados por ventura pratiquem.'},
                {description: 'Todos os equipamentos locados informados na aba Descrição devem permanecer no Espaço Kids, não sendo permitido sua remoção e utilização em outros ambientes do evento.'},
                {description: 'Para a realização do evento a contratada fornecera, todos os equipamentos de diversão constantes na aba Descrição pelo preço certo e ajustado, responsabilizando-se pelo transporte, montagem e desmontagem dos equipamentos, bem como o monitoramento de seu uso.'},
                {description: 'O pagamento deverá ser efetuado até 15 dias antes do evento, via depósito bancário ou PIX.'},
                {description: 'Se o contratante rescindir o contrato, pagará a contratada multa de 30% sobre o valor total acordado descrito anverso.'},
            ], { path: '/' });
        }
    }

    componentDidMount() {
        if (cookies.get('default-clauses') !== undefined) {
            this.setState({
                clauses: cookies.get('default-clauses')
            })
        }
    }

    handleContractorName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({contractorName: e.target.value})
    }

    handlerContractorCpf(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({contractorCpf: e.target.value})
    }

    handleItemDescription(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({itemDescription: e.target.value})
    }

    handleItemValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({itemValue: +e.target.value})
    }

    handleCeremonyHour(date: Moment | null, dateString: string) {
        this.setState({ceremonyHour: date})
    }

    handleBeginHour(date: Moment | null, dateString: string) {
        this.setState({beginHour: date})
    }

    handleEndHour(date: Moment | null, dateString: string) {
        this.setState({endHour: date})
    }

    handleEventDate(date: Moment | null, dateString: string) {
        this.setState({eventDate: date})
    }

    handleContractorCity(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({eventCityState: e.target.value})
    }

    handleContractorAddress(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({eventAddress: e.target.value})
    }

    handleContractorNeighborhood(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({eventNeighborhood: e.target.value})
    }

    handleEventLocation(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({eventLocation: e.target.value})
    }

    handleCancelAddItem() {
        this.setState({
            itemValue: 0, 
            itemDescription: '', 
            visible: false
        })
    }

    handleAddItem() {
        this.setState({
            visible: false, 
            itens: [...this.state.itens, {itemDescription: this.state.itemDescription, itemValue: this.state.itemValue}],
            itemDescription: '',
            itemValue: 0
        })
        
        var totalValueTemp = this.state.itemValue;

        this.state.itens.forEach(item => {
            totalValueTemp = totalValueTemp + item.itemValue
        })

        this.setState({
            totalValue: totalValueTemp
        })
    }

    handleTotalValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({totalValue: +e.target.value})
    }

    handleObservation(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({observation: e.target.value})
    }

    handleChangeValorIgual(e: CheckboxChangeEvent) {
        if (this.state.valorIgual) {
            this.setState({valorIgual: false})
            this.setState({totalValue: 0})

        } else {
            this.setState({valorIgual: true})
            let totalValueTemp = 0

            this.state.itens.forEach(item => {
                totalValueTemp = totalValueTemp + item.itemValue
            })

            this.setState({
                totalValue: totalValueTemp
            })
        }
    }

    handleAddClausule() {
        this.setState({
            clauses: [...this.state.clauses, {description: ''}],
        })
    }

    handleClausule(e: React.ChangeEvent<HTMLTextAreaElement>, index: number) {
        let clausulesCopy = [...this.state.clauses];
        let clausuleToChange = {...clausulesCopy[index]}
        clausuleToChange.description = e.target.value

        clausulesCopy[index] = clausuleToChange

        this.setState({clauses: clausulesCopy})
    }

    handleDeleteClausule(index: number) {
        let clausulesCopy = [...this.state.clauses];
        clausulesCopy.splice(index, 1);
        this.setState({clauses: clausulesCopy})
    }

    handleRemoveItem(index: number) {
        let itensCopy = [...this.state.itens];

        if (this.state.valorIgual) {
            this.setState({
                totalValue: this.state.totalValue - itensCopy[index].itemValue
            })
        }

        itensCopy.splice(index, 1);
        this.setState({itens: itensCopy})
    }

    handleGenerate() {
        let clausuleWithNumber: Array<IClausule> = this.state.clauses.map((clausule,index) => ({description:(index+1) + ". " + clausule.description}));
        generateReport({
            valorIgual: this.state.valorIgual,
            contractorName: this.state.contractorName,
            contractorCpf: this.state.contractorCpf,
            endHour: this.state.endHour ? this.state.endHour.format('HH:mm') : '',
            eventAddress: this.state.eventAddress,
            eventCityState: this.state.eventCityState,
            eventDate: this.state.eventDate,
            eventLocation: this.state.eventLocation,
            eventNeighborhood: this.state.eventNeighborhood,
            observation: this.state.observation,
            totalValue: this.state.totalValue,
            beginHour: this.state.beginHour ? this.state.beginHour.format('HH:mm') : '',
            ceremonyHour: this.state.ceremonyHour ? this.state.ceremonyHour.format('HH:mm') : '',
            clauses: clausuleWithNumber,
            itens: this.state.itens,
            showItemValue: this.state.valorIgual
        });
    }

    render() {

        const { Content } = Layout;
        const { TextArea } = Input;
        const { Option } = Select;
        const format = 'HH:mm';

        const { visible, 
            valorIgual: valorDiferente,
            contractorName,
            contractorCpf,
            endHour,
            eventAddress,
            eventCityState,
            eventDate,
            eventLocation,
            eventNeighborhood,
            observation,
            totalValue,
            beginHour,
            ceremonyHour,
            clauses: clausules,
            itens,
            itemDescription,
            itemValue
        } = this.state;

        return(
            <>
            <Layout className="layout">
                <Content style={{ padding: '0 50px', margin: '16px 0', }}>
                <div className="site-layout-content">
                <Divider orientation="left">Dados do contratante</Divider>
                    <Row>
                        <Col span={18}>
                            <Form layout="vertical">
                            <Form.Item label="Contratante" wrapperCol={{ span: 23 }} rules={[{ required: true, message: 'Please input your username!' }]}>
                                <Input placeholder="Nome do contratante" value={contractorName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleContractorName(e)}/>
                            </Form.Item>
                            </Form>
                        </Col>

                        <Col span={6}>
                            <Form layout="vertical">
                            <Form.Item label="CPF" wrapperCol={{ span: 24 }}>
                                <Input 
                                    placeholder="CPF do contratante" 
                                    value={contractorCpf}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handlerContractorCpf(e)}
                                />
                            </Form.Item>
                            </Form>
                        </Col>
                    </Row>

                    <Row>
                    <Col span={16}>
                        <Form layout="vertical">
                        <Form.Item label="Cidade" wrapperCol={{ span: 23 }}>
                            <Input placeholder="Cidade do contratante" value={eventCityState} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleContractorCity(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>

                    <Col span={8}>
                        <Form layout="vertical">
                        <Form.Item label="Estado" wrapperCol={{ span: 24 }}>
                            <Select defaultValue="SC" >
                            <Option value="SC">Santa Catarina</Option>
                            <Option value="RS">Rio Grande do Sul</Option>
                            <Option value="PR">Paraná</Option>
                            </Select>
                        </Form.Item>
                        </Form>
                    </Col>
                    </Row>

                    <Row>
                    <Col span={14}>
                        <Form layout="vertical" wrapperCol={{ span: 23 }}>
                        <Form.Item label="Endereço">
                            <Input placeholder="Endereço do contratante" value={eventAddress} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleContractorAddress(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>

                    <Col span={10}>
                        <Form layout="vertical" wrapperCol={{ span: 24 }}>
                        <Form.Item label="Bairro">
                            <Input placeholder="Bairro do contratante" value={eventNeighborhood} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleContractorNeighborhood(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                    </Row>

                    <Divider orientation="left">Dados do evento</Divider>

                    <Row>
                    <Col span={24}>
                        <Form layout="vertical" wrapperCol={{ span: 24 }}>
                        <Form.Item label="Local do evento">
                            <Input placeholder="Local do evento" value={eventLocation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleEventLocation(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                    </Row>

                    <Row>
                    <Col span={12}>
                        <Form layout="vertical" wrapperCol={{ span: 23 }}>
                        <Form.Item label="Data do evento" >
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} value={eventDate} onChange={(date: Moment | null, dateString: string) => this.handleEventDate(date, dateString)}/>
                        </Form.Item>
                        </Form>
                    </Col>

                    <Col span={12}>
                        <Form layout="vertical" wrapperCol={{ span: 24 }}>
                        <Form.Item label="Horário de início" >
                            <TimePicker defaultValue={moment('12:00', format)} format={format} style={{ width: '100%' }} value={beginHour} onChange={(date: Moment | null, dateString: string) => this.handleBeginHour(date, dateString)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                    </Row>

                    <Row>
                    <Col span={12}>
                        <Form layout="vertical" wrapperCol={{ span: 23 }}>
                        <Form.Item label="Horário de término">
                            <TimePicker defaultValue={moment('12:00', format)} format={format}  style={{ width: '100%' }} value={endHour} onChange={(date: Moment | null, dateString: string) => this.handleEndHour(date, dateString)}/>
                        </Form.Item>
                        </Form>
                    </Col>

                    <Col span={12}>
                        <Form layout="vertical" wrapperCol={{ span: 24 }}>
                        <Form.Item label="Horário da cerimônia" >
                            <TimePicker defaultValue={moment('12:00', format)} format={format} style={{ width: '100%' }} value={ceremonyHour} onChange={(date: Moment | null, dateString: string) => this.handleCeremonyHour(date, dateString)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                    </Row>

                    <Divider orientation="left">Itens</Divider>

                    <List
                    dataSource={itens}
                    loadMore={
                        <div
                        style={{
                            textAlign: 'center',
                            marginTop: 12,
                            height: 32,
                            lineHeight: '32px',
                        }}
                        >
                        <Button onClick={() => this.setState({visible: true})}>Adicionar novo item</Button>
                        </div>
                    }
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta description={item.itemDescription}/>
                            <div>R$ {item.itemValue}</div>
                            <Button size="small" shape="circle" danger style={{marginLeft: '10px'}} onClick={() => this.handleRemoveItem(index)}>X</Button>
                        </List.Item>
                    )}
                    />

                <Modal
                    title="Adicionar novo item"
                    centered
                    visible={visible}
                    onOk={() => this.handleAddItem()}
                    onCancel={() => this.handleCancelAddItem()}
                    width={600}
                >
                    <Row>
                    <Col span={20}>
                        <Form layout="vertical" wrapperCol={{ span: 23 }}>
                        <Form.Item label="Descrição">
                            <Input placeholder="Descrição do item" value={itemDescription} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleItemDescription(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>

                    <Col span={4}>
                        <Form layout="vertical" wrapperCol={{ span: 24 }}>
                        <Form.Item label="Valor" >
                            <Input prefix="R$" value={itemValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleItemValue(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                    </Row>
                </Modal>
                
                <Divider />

                <Row>
                    <Col  span={14}>
                    <Checkbox onChange={(e: CheckboxChangeEvent) => this.handleChangeValorIgual(e)}>Informar valor total diferente da soma dos itens</Checkbox>
                    </Col>
                    <Col span={10}>
                    <Form  wrapperCol={{ span: 24 }}>
                        <Form.Item label="Valor Total">
                            <Input prefix="R$" disabled={valorDiferente} value={totalValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleTotalValue(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form >
                        <Form.Item label="Observação" wrapperCol={{ span: 24 }}>
                            <Input placeholder="Observação sobre os itens" value={observation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleObservation(e)}/>
                        </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <Divider orientation="left">Cláusulas</Divider>
                
                {clausules.map((clausule, index) => (
                    <>
                        <Row style={{marginTop: '20px'}}>
                            <Col span={22}>
                            <h4>{index + 1}ª cláusula</h4>
                            </Col>

                            <Col span={2}>
                            <Button danger style={{marginBottom: '5px'}} onClick={() => this.handleDeleteClausule(index)}>Excluir</Button>
                            </Col>
                        </Row>
                                
                        <Row>
                            <Col span={24}>
                            <TextArea rows={3} value={clausule.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.handleClausule(e, index)}/>
                            </Col>
                        </Row>
                    </>
                ))}

                <Divider/>

                <Row>
                    <Col span={19}></Col>
                    <Col span={3}>
                    <Button type='primary' onClick={() => this.handleAddClausule()}>Adicionar nova cláusula</Button>
                    </Col>
                </Row>

                <Divider/>

                    <Button type="primary" block onClick={() => this.handleGenerate()}>
                    Gerar contrato
                    </Button>
                </div>
                </Content>
            </Layout>
            </>
        )
    }
}