<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Actionable emails e.g. reset password</title>
    <link href="style.css" media="all" rel="stylesheet" type="text/css"/>
</head>

<body itemscope itemtype="http://schema.org/EmailMessage">

<table class="body-wrap">
    <tr>
        <td></td>
        <td class="container" width="600">
            <div class="content">
                <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope
                       itemtype="http://schema.org/ConfirmAction">
                    <tr>
                        <td class="content-wrap">
                            <meta itemprop="name" content="Confirm Email"/>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="content-block">
                                        Hola <strong>{{ to.email }}</strong>.
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        Por favor confirma tu correo haciendo click en link de abajo.
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        Nosotros enviamos informacion acerca de nuestro servicios y es importante un
                                        correo exacto.
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block" itemprop="handler" itemscope
                                        itemtype="http://schema.org/HttpActionHandler">
                                        <a href="{{baseUrl}}/auth/verify/{{to.tokenVerifyEmail}}" class="btn-primary" itemprop="url">Confirmar
                                            correo</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-block">
                                        &mdash; Arte Manifiesto
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div class="footer">
                    <table width="100%">
                        <tr>
                            <td class="aligncenter content-block">Siguenos <a
                                        href="https://twitter.com/artemanifiesto">@ArteManifiesto</a> en Twitter.
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </td>
        <td></td>
    </tr>
</table>

</body>
</html>
