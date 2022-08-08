const request = require('supertest')
const app = require('../src/app')
const Appointment = require('../src/model/Appointment')
const mongoose = require('mongoose')

const testApptId = new mongoose.Types.ObjectId()
const testUserId = new mongoose.Types.ObjectId()
const testAppt = {
	_id: testApptId,
	name: 'Test Appointment',
	type: 'Test',
	description: 'Test description',
	metadata: 'test',
	userId: testUserId,
}

beforeEach(async () => {
	await Appointment.deleteMany({ metadata: 'test' })
	await new Appointment(testAppt).save()
})

afterAll(async () => {
	await Appointment.deleteMany({ metadata: 'test' })
})

test('Create a new Appointment', async () => {
	const res = await request(app)
		.post('/appointments')
		.send({
			name: 'Fake appointment',
			description: 'fake description',
			type: 'fake',
			metadata: 'test',
			userId: new mongoose.Types.ObjectId(),
		})
		.expect(201)

	const savedAppt = await Appointment.findById(res.body._id)

	expect(savedAppt).not.toBeNull()
})

test('Find an Appointment by ID', async () => {
	const res = await request(app)
		.get('/appointments/' + testApptId.toString())
		.expect(200)

	expect(res.body).not.toBeNull()
})

test('Does not find non-existing Appointment', async () => {
	const res = await request(app)
		.get('/appointments/' + new mongoose.Types.ObjectId().toString())
		.expect(404)

	expect(res.body).toEqual({})
})

test('Finds appointments by userID', async () => {
	const res = await request(app)
		.get('/appointments/user/' + testUserId.toString())
		.expect(200)

	console.log(res.body)
	expect(res.body).not.toBeNull()
})

test('Does not find appointments for non-existant user', async () => {
	const res = await request(app)
		.get('/appointments/user/' + new mongoose.Types.ObjectId().toString())
		.expect(404)

	console.log(res.body)
	expect(res.body).toEqual({})
})

test('Delete an existing Appointment by ID', async () => {
	const res = await request(app)
		.delete('/appointments/' + testApptId.toString())
		.expect(200)

	const deletedAppt = await Appointment.findById(testApptId)

	expect(deletedAppt).toBeNull()
})

test('Does not delete a non-existant appointment', async () => {
	const res = await request(app)
		.delete('/appointments/' + new mongoose.Types.ObjectId().toString())
		.expect(404)
})
