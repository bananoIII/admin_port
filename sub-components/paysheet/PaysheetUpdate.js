// import node module libraries
'use client'
import { useRouter } from 'next/navigation';
import { Col, Row, Form, Card, Button, Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
// import widget as custom components
import { FormSelect, DropFiles } from 'widgets';
import DataTable from 'react-data-table-component';

// import hooks
import useMounted from 'hooks/useMounted';

const PaysheetUpdate = ({payrollId}) => {
  const hasMounted = useMounted();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const id = payrollId
  const router = useRouter();
  const [period, setPeriod] = useState({
    start_date: "",
    end_date: "",
    payment_date: "",
    type: ""
  });
  
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/admin_v2/payroll/${id}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.period) setPeriod(data.period);
      if (data.workers) setWorkers(data.workers);
    };
    fetchData();
  }, [id]);



  const handleReturn = async () => {

  };

  const columns = [
    { 
      name: 'Nombre', 
      selector: row => row.workerDetails.firstName+ ' '+  row.workerDetails.lastName, 
      sortable: true,
      right: true
    },
    { 
      name: 'Salario Base', 
      selector: row => row.earnings.base_salary, 
      sortable: true,
      right: true
    },
    { 
      name: 'Bonos', 
      selector: row => row.earnings.bonuses, 
      sortable: true,
      right: true
    },
    { 
      name: 'Impuesto', 
      selector: row => row.deductions.income_tax, 
      sortable: true,
      right: true
    },
    { 
      name: 'Seguridad Social', 
      selector: row => row.deductions.social_security, 
      sortable: true,
      right: true
    },
    { 
      name: 'Total Ganancias', 
      selector: row => row.totals.total_earnings, 
      sortable: true,
      right: true
    },
    { 
      name: 'Total Deducciones', 
      selector: row => row.totals.total_deductions, 
      sortable: true,
      right: true
    },
    { 
      name: 'Pago Neto', 
      selector: row => row.totals.net_pay, 
      sortable: true,
      right: true
    },
  ];
  
  return (
    <Row className="mb-8">
      <Col xl={12}>
        <Card>
          <Card.Body>
              <Row className="mb-3">
              <h4>Periodo</h4>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Fecha Inicio</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      value={period.start_date} readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Fecha Fin</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      value={period.end_date} readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Fecha Pago</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      value={period.payment_date} readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Tipo</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={period.type} readOnly
                    />
                  </Col>
                </Row>
                <h4>Trabajadores</h4>
                <DataTable
                  columns={columns}
                  data={workers}
                  pagination
                  responsive
                  striped
                  highlightOnHover
                  noDataComponent="No hay workers disponibles."
                />
      
              </Row>
          </Card.Body>
        </Card>
      </Col>
      </Row>
  );
}


export default PaysheetUpdate



