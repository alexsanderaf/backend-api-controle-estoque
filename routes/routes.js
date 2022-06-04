const express = require('express');
const router = express.Router();
const moment = require('moment')
const connect = require('../database/database').pool;

router.get('/get-all', (req, res) => { //http://localhost:3000/storage/get-all
    connect.getConnection((error, conn) => {
        if (error) return res.status(500).json({ error: error })

        connect.query(
            'SELECT * FROM itens',
            (error, result, fields) => {
                
                connect.releaseConnection(conn)

                if (error) return res.status(500).json({ error: error })
                

                const response = {
                    itens: result.map(item => {
                        return {
                            id: item.item_id,
                            name: item.item_name,
                            quantity: item.item_quantity,
                            category: item.item_category,
                            locale: item.item_locale,
                            description: item.item_description,
                            createdAt: moment(item.createdAt).locale('pt-br').format('L'),
                            updatedAt: moment(item.createdAt).locale('pt-br').format('L')

                        }
                    })
                }
                
                res.status(200).json({ response })
            }

        )
    })
})

router.get('/get-id/:id', (req, res) => { //http://localhost:3000/storage/get-id/:id
    connect.getConnection((error, conn) => {
        if (error) return res.status(500).json({ error: error })

        connect.query(
            'SELECT * FROM itens where item_id = ?', [req.params.id],
            (error, result, fields) => {
                connect.releaseConnection(conn)

                if (error) return res.status(500).json({ error: error })

                const response = {
                    item:
                    {
                        id: result[0].item_id,
                        name: result[0].item_name,
                        quantity: result[0].item_quantity,
                        category: result[0].item_category,
                        locale: result[0].item_locale,
                        description: result[0].item_description,
                        createdAt: moment(result[0].createdAt).locale('pt-br').format('L'),
                        updatedAt: moment(result[0].updatedAt).locale('pt-br').format('L')
                        
                    }
                }

                res.status(200).json({ response })
            }

        )
    })
})

router.get('/get-name/:name', (req, res) => { //http://localhost:3000/storage/get-name/:name
    connect.getConnection((error, conn) => {
        if (error) return res.status(500).json({ error: error })

        connect.query(
            'SELECT * FROM itens WHERE LOCATE( ?, item_name) > 0 ', [req.params.name],
            (error, result, fields) => {
                connect.releaseConnection(conn)

                if (error) return res.status(500).json({ error: error })

                const response = {
                    item: result.map(item => {
                        return {
                            id: item.item_id,
                            name: item.item_name,
                            quantity: item.item_quantity,
                            category: item.item_category,
                            locale: item.item_locale,
                            description: item.item_description,
                            createdAt: moment(item.createdAt).locale('pt-br').format('L'),
                            updatedAt: moment(item.createdAt).locale('pt-br').format('L')

                        }
                    })

                }

                res.status(200).json({ response })
            }

        )
    })
})

router.get('/get-category/:category', (req, res) => { //http://localhost:3000/storage/get-category/:category
    connect.getConnection((error, conn) => {
        if (error) return res.status(500).json({ error: error })

        connect.query(
            'SELECT * FROM itens WHERE LOCATE( ?, item_category) > 0 ', [req.params.category],
            (error, result, fields) => {
                connect.releaseConnection(conn)

                if (error) return res.status(500).json({ error: error })

                const response = {
                    item: result.map(item => {
                        return {
                            id: item.item_id,
                            name: item.item_name,
                            quantity: item.item_quantity,
                            category: item.item_category,
                            locale: item.item_locale,
                            description: item.item_description,
                            createdAt: moment(item.createdAt).locale('pt-br').format('L'),
                            updatedAt: moment(item.createdAt).locale('pt-br').format('L')

                        }
                    })

                }

                res.status(200).json({ response })
            }

        )
    })
})

router.post('/insert-item', (req, res) => { //http://localhost:3000/storage/insert-item (inserir informações no body)
    connect.getConnection((error, conn) => {
        if (error) { return res.json({ error: error }) }
        connect.query(
            'insert into itens (item_name, item_quantity, item_category, item_locale, item_description) values (?, ?, ?, ?, ?)',
            [req.body.name, req.body.quantity, req.body.category, req.body.locale, req.body.description],
            (error, result, field) => {
                connect.releaseConnection(conn);

                if (error) { return res.status(500).json({ error: error }) }

                const response = {
                    message: 'Item successfully added',
                    addedItem: {
                        id: result.insertId,
                        name: req.body.name,
                        quantity: req.body.quantity,
                        category: req.body.category,
                        locale: req.body.locale,
                    }
                }

                res.status(201).json({ response })
            }
        )

    })
})

router.patch('/change-item', (req, res) => { //http://localhost:3000/storage/change-item (inserir informações no body)
    connect.getConnection((error, conn) => {
        if (error) { res.status(500).json({ error: error }) }

        conn.query(
            'UPDATE itens SET item_quantity = ?, item_locale = ? WHERE item_id = ?',
            [req.body.quantity, req.body.locale, req.body.id],
            (error, result, field) => {
                connect.releaseConnection(conn);

                if (error) { return res.status(500).json({ error: error }) }

                return res.status(202).json({
                    message: 'Item updated successfully',
                })
            }
        )
    })
})

router.delete('/delete-item/:id', (req, res) => { //http://localhost:3000/storage/delete-item (inserir informações no body)
    connect.getConnection((error, conn) => {
        if (error) {res.status(500).json({error: error})}

        conn.query(
            'DELETE FROM itens WHERE item_id = ?',
            [req.params.id],
            (error, result, field) => {
                connect.releaseConnection(conn);

                if(error) {return res.status(500).json({error: error})}

                return res.status(202).json({message: 'Item deleted successfully'})
            }
        )

    })
})

module.exports = router;

