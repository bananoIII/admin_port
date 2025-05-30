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

const WorkerSetting = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter();
  // Estados para trabajador
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [rfc, setRfc] = useState("");

  // Contacto
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Dirección
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Info laboral
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [seniority, setSeniority] = useState("");
  const [workStartTime, setWorkStartTime] = useState("");
  const [workEndTime, setWorkEndTime] = useState("");

  // Datos de usuario sistema
  const [systemEmail, setSystemEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Armar el objeto que coincida con tu backend
    const payload = {
      worker: {
        firstName,
        lastName,
        birthDate,
        gender,
        rfc,
        contact: {
          email: contactEmail,
          phone,
        },
        address: {
          street,
          city,
          state,
          country,
          zipCode,
        },
        jobInfo: {
          position,
          salary: Number(salary),
          seniority: Number(seniority),
          workStartTime,
          workEndTime,
        },
      },
      user: {
        email: systemEmail,
        password,  // Asumiendo que en backend se encripta
        role: position, // o el rol que quieras asignar
      },
    };

    try {
      const res = await fetch(`${API_URL}/admin_v2/worker`, {
        method: "POST",credentials: 'include',

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al guardar trabajador");
      }

      // Puedes mostrar un mensaje o hacer reset si quieres
      router.push("/admin/workers"); // Redirige tras guardar
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el trabajador");
    }
  };
 


  return (
    <Row className="mb-8">
      <Col xl={12}>
        <Card>
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Registrar nuevo trabajador</h4>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Datos personales */}
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Nombre</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Apellido</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Fecha de nacimiento</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Género</Form.Label>
                <Col sm={8}>
                  <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Seleccione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">RFC</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Contacto */}
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Email de contacto</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Teléfono</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Dirección */}
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Calle</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Ciudad</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Estado</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">País</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Código Postal</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Información laboral */}
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Puesto</Form.Label>
                <Col sm={8}>
                  <Form.Select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="pilot">Piloto</option>
                    <option value="flight attendant">Azafata</option>
                    <option value="baggage handler">Check-in</option>
                    <option value="counter agent">Mostrador</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Salario</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Antigüedad (años)</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="number"
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Hora de entrada</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Hora de salida</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="time"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Usuario */}
              <Row className="mb-3">
                <Form.Label className="col-sm-4">Email del sistema</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="email"
                    value={systemEmail}
                    onChange={(e) => setSystemEmail(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label className="col-sm-4">Contraseña</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Botón */}
              <Row>
                <Col className="text-end">
                  <Button variant="primary" type="submit">
                    Guardar trabajador
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



export default WorkerSetting