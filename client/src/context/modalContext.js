import React, { useState, useEffect } from 'react'
import { Modal, Backdrop, Fade, makeStyles } from '@material-ui/core'
import { isEmpty } from 'lodash'

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
    padding: theme.spacing(2, 4, 3),
    outline: 0,
    borderRadius: 8,
    color: theme.palette.text.primary
  }
}));

const ModalProvider = ({ children }) => {
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
    <ModalContext.Provider value={{
      setModalProps
    }}>
      {children}
      <Modal
        open={open}
        className={classes.modal}
        onClose={() => handleModalState(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={open}>
          <div className={classes.background}>
            {React.isValidElement(modalProps.component) && (
              React.cloneElement(modalProps.component, modalProps.props)
            )}
          </div>
        </Fade>
      </Modal>
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
