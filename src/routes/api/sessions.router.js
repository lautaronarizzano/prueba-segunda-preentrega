import {
    Router
} from 'express'
import userModel from '../../dao/models/usersModel.js'
import passport from 'passport';
import {
    generateToken,
    isValidPassword
} from '../../utils.js';

const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: 'fail-register'
}), async (req, res) => {
    res.send({
        status: 'success',
        message: 'user Registered'
    })
})

router.get('/fail-register', async (req, res) => {
    res.send({
        status: 'error',
        message: 'register failed'
    })
})


router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

    try {
        const user = await userModel.findOne({email: email})

        if (!user) {
            return res.status(404).send('User not found')
        }

        if (!isValidPassword(user, password)) return res.status(400).send('Incorrect credentials')

        const accessToken = generateToken(user)


        res.cookie('cookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .send({ status: 'success', message: 'login success' });
    } catch (error) {
        res.status(400).send({error: error})
        }
});



router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({
            status: 'error',
            error: "couldn't logout"
        })
        res.redirect('/login')
    })
})

router.get('/current', passport.authenticate("current", { session: false }), (req, res) => {
    res.status(200).send({ status: 'success', payload: req.user})
})

router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}), async (req, res) => {
    res.send({
        status: 'success',
        message: 'user registered'
    })
})

router.get('/github-callback', passport.authenticate('github', {
    failureRedirect: '/login'
}), (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

export default router