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
}