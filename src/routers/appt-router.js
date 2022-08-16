const express = require('express')
const Appointment = require('../model/Appointment')

const router = new express.Router()

router.get('/appointments', async (req, res) => {
	try {
		const appts = await Appointment.find()
		res.send(appts)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/appointments/user/:userId', async (req, res) => {
	try {
		const apptList = await Appointment.find({ userId: req.params.userId })

		if (appts.length === 0) {
			return res.status(404).send([])
		}

		res.send(apptList)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/appointments/:apptId', async (req, res) => {
	const _id = req.params.apptId

	try {
		const appt = await Appointment.findOne({ _id })

		if (!appt) {
			return res.status(404).send()
		}

		res.send(appt)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/appointments/search/:apptName', async (req, res) => {
	const apptName = req.params.apptName

	try {
		const apptList = await Appointment.find({ name: apptName })

		if (apptList.length === 0) {
			return res.status(404).send()
		}

		res.send(apptList)
	} catch (e) {
		res.status(500).send()
	}
})

router.post('/appointments', async (req, res) => {
	const appt = new Appointment({
		...req.body,
	})

	try {
		await appt.save()
		res.status(201).send(appt)
	} catch (e) {
		res.status(500).send()
	}
})

router.patch('/appointments/:apptId', async (req, res) => {
	const updates = Object.keys(req.body)

	const allowedUpdates = [
		'name',
		'description',
		'type',
		'startTime',
		'endTime',
		'metadata',
	]

	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {
		const appt = await Appointment.findOne({
			_id: req.params.apptId,
		})

		if (!appt) {
			return res.status(400).send()
		}

		updates.forEach((update) => (appt[update] = req.body[update]))
		await appt.save()

		res.send(appt)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/appointments/:apptId', async (req, res) => {
	try {
		const appt = await Appointment.findOneAndDelete({
			_id: req.params.apptId,
		})

		if (!appt) {
			return res.status(404).send()
		}

		res.send(appt)
	} catch (e) {
		res.status(500).send(e)
	}
})

module.exports = router
