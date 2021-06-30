import React, { useState, useEffect } from 'react'
import { Modal, Backdrop, makeStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { isEmpty } from 'lodash'
import { motion, AnimatePresence } from 'framer-motion'

const ModalContext = React.createContext()

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '40px 40px',
    outline: 0,
    borderRadius: 8,
    color: theme.palette.text.primary,
    position: 'relative',
    minWidth: '40%',
  },
  closeIcon: {
    cursor: 'pointer',
    position: 'absolute',
    top: '-22px',
    right: '-20px',
  },
  modalHeader: {
    fontSize: '20px',
    marginBottom: '30px',
  },
}))

const ModalProvider = ({ children: app }) => {
  const classes = useStyles()

  const [modalProps, setModalProps] = useState({})
  const [open, setOpen] = useState(false)

  const handleModalState = (open) => {
    setOpen(open)
  }

  useEffect(() => {
    if (!isEmpty(modalProps)) {
      handleModalState(true)
    }
  }, [modalProps])

  return (
    <ModalContext.Provider
      value={{
        setModalProps,
      }}
    >
      {app}
      <AnimatePresence>
        {open && (
          <Modal
            open={open}
            className={classes.modal}
            onClose={() => handleModalState(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
          >
            <motion.div
              key='modal'
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 50, opacity: 0 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'tween' }}
              className={classes.background}
            >
              <CloseIcon
                onClick={() => handleModalState(false)}
                className={classes.closeIcon}
              />
              <div className={classes.modalHeader}>{modalProps.header}</div>
              {React.isValidElement(modalProps.component) &&
                React.cloneElement(modalProps.component, modalProps.props)}
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}

const useModalContext = () => {
  const context = React.useContext(ModalContext)

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }

  return context
}

export { ModalProvider, useModalContext }
