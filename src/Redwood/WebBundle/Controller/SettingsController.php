<?php 

namespace Redwood\WebBundle\Controller;

class SettingsController extends BaseController
{

    public function profileAction() 
    {
    	$user = $this->getCurrentUser();
        return $this->render('RedwoodWebBundle:Settings:base.html.twig', array(
            'user' => $user,
        ));
    }

    public function avatarAction()
    {
        $user = $this->getCurrentUser();
        $form = $this->createFormBuilder()
            ->add('avatar', 'file')
            ->getForm();

        return $this->render('RedwoodWebBundle:Settings:avatar.html.twig',array(
            'user' => $user,
            'form' => $form->createView(),
        ));
    }
}