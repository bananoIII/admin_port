// import node module libraries
'use client'
import { useRouter } from 'next/navigation';
import { Col, Row, Form, Card, Button, Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// import widget as custom components
import { FormSelect, DropFiles } from 'widgets';

// import hooks
import useMounted from 'hooks/useMounted';

const PaysheetSetting = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter();
  const [workers, setWorkers] = useState([]);
  const [date, setdate] = useState("");

  useEffect(() => {
    const fetchWorkers = async () => {
      const res = await fetch(`${API_URL}/admin_v2/workers/basic-info`, {
        credentials: 'include',
      });
      const data = await res.json();
      const enriched = data.map(worker => ({
        ...worker,
        bonus: 0,
        total: worker.jobInfo.salary,
      }));
      setWorkers(enriched);
    };
  
    fetchWorkers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentDate = new Date(date);

    const startDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);
    const endDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0);

    const formatDate = (d) => d.toISOString().split("T")[0];
  
    const payrollPayload = {
      period: {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        payment_date: formatDate(paymentDate),
        type: "monthly"
      },
      workers: workers.map(w => ({
        workerId: w._id,
        earnings: {
          base_salary: Number(w.jobInfo.salary),
          bonuses: Number(w.bonus || 0)
        }
      }))
    };

    try {
      const res = await fetch(`${API_URL}/admin_v2/payroll`, {
        method: "POST",credentials: 'include',

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payrollPayload),
      });
  
      if (!res.ok) throw new Error("Error al guardar nómina");
      const data = await res.json();
      if (data.message && data.message.includes("correctamente")) {
        router.push('/admin/paysheet')
      } else {
        alert("⚠️ " + data.message);
      }
      
    } catch (error) {

      console.error("Error al guardar nómina:", error);
      alert(error); // ahora sí contiene el mensaje del backend
    }
  };
  

  return (
    <Row className="mb-8">
      <Col xl={12}>
        <Card>
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Registrar nueva nomina</h4>
            </div>
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Fecha del pago</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setdate(e.target.value)}
                    required
                  />
                </Col>
              </Row>

            <Form onSubmit={handleSubmit}>

              {workers.map((worker, index) => (
                <Row className="mb-3" key={worker._id}>
                  <Col sm={4}>
                    <Form.Label>
                      {worker.firstName} {worker.lastName}
                    </Form.Label>
                  </Col>

                  <Col sm={2}>
                    <Form.Control
                      type="number"
                      value={worker.jobInfo.salary}
                      readOnly
                    />
                  </Col>

                  <Col sm={2}>
                    <Form.Control
                      type="number"
                      value={worker.bonus}
                      onChange={(e) => {
                        const bonus = Number(e.target.value);
                        const updated = [...workers];
                        updated[index].bonus = bonus;
                        updated[index].total = bonus + worker.jobInfo.salary;
                        setWorkers(updated);
                      }}
                    />
                  </Col>

                  <Col sm={2}>
                    <Form.Control
                      type="number"
                      value={worker.total}
                      readOnly
                    />
                  </Col>
                </Row>
              ))}

              {/* Botón */}
              <Row>
                <Col className="text-end">
                  <Button variant="primary" type="submit">
                    Generar nomina
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>

  );
};



export default PaysheetSetting