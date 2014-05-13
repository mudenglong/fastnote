<?php 

namespace Redwood\WebBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Redwood\Common\FileToolkit;
class SettingsController extends BaseController
{

    public function profileAction() 
    {
    	$user = $this->getCurrentUser();
        return $this->render('RedwoodWebBundle:Settings:base.html.twig', array(
            'user' => $user,
        ));
    }

    public function avatarAction(Request $request)
    {
        $user = $this->getCurrentUser();
        $form = $this->createFormBuilder()
            ->add('avatar', 'file')
            ->getForm();
        if ($request->getMethod() == 'POST') {
            $form->bind($request);
            if ($form->isValid()) {
                $data = $form->getData();
                $file = $data['avatar'];
                
                if (!FileToolkit::isImageFile($file)) {
                    return $this->createMessageResponse('error', '上传图片格式错误，请上传jpg, gif, png格式的文件。');
                }
            }

        }
        
        return $this->render('RedwoodWebBundle:Settings:avatar.html.twig',array(
            'user' => $user,
            'form' => $form->createView(),
        ));
    }
}