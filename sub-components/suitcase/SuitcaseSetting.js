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

const SuitcaseSetting = () => {

  const router = useRouter()
  const hasMounted = useMounted();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [modelo, setModelo] = useState("");




  const handleSubmit = async (e) => {
    e.preventDefault();

    const planeData = {
      modelo:modelo,
      numero_serie: numeroSerie,
      asientos: {
        normales: parseInt(asientosNormales),
        premium: parseInt(asientosPremium)
      },
      peso_maximo_kg: parseFloat(pesoMaximoKg),
      estado
    };

    try {
      const response = await fetch(`${API_URL}/admin_v2/plane`, {
        method: 'POST',credentials: 'include',

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planeData)
      });
  
      if (response.ok) {

        router.push('/admin/plane');
      } else {
        const error = await response.json();
        console.error("Error al guardar:", error);
        alert("Error al guardar el vuelo");
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Error de red");
    }
  };


  return (
    <Row className="mb-8">
      <Col xl={12}>
        <Card>
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Registrar nuevo avión</h4>
            </div>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Modelo</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Número de serie</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Asientos normales</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="number"
                    value={asientosNormales}
                    onChange={(e) => setAsientosNormales(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Asientos premium</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="number"
                    value={asientosPremium}
                    onChange={(e) => setAsientosPremium(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Peso máximo (kg)</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="number"
                    value={pesoMaximoKg}
                    onChange={(e) => setPesoMaximoKg(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Estado</Form.Label>
                <Col sm={8}>
                  <Form.Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="en mantenimiento">En mantenimiento</option>
                    <option value="fuera de servicio">Fuera de servicio</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row>
                <Col className="text-end">
                  <Button variant="primary" type="submit">
                    Guardar avión
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



export default SuitcaseSetting