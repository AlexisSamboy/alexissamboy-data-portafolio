# Calculadora de nómina (RD) - versión sencilla para GitHub
# Autor: Alexis Samboy (https://github.com/AlexisSamboy)

SFS_RATE = 0.0304
AFP_RATE = 0.0287
DIAS_LABORABLES_PROM = 23.83
HORAS_DIA = 8

def pedir_float(mensaje: str) -> float:
    while True:
        try:
            valor = float(input(mensaje))
            if valor < 0:
                print("INGRESA UN VALOR MAYOR O IGUAL A 0.\n")
                continue
            return valor
        except ValueError:
            print("INGRESA UN VALOR NUMÉRICO VÁLIDO.\n")

def pedir_int(mensaje: str, min_val=None, max_val=None) -> int:
    while True:
        try:
            valor = int(input(mensaje))
            if min_val is not None and valor < min_val:
                print(f"INGRESA UN VALOR >= {min_val}.\n")
                continue
            if max_val is not None and valor > max_val:
                print(f"INGRESA UN VALOR <= {max_val}.\n")
                continue
            return valor
        except ValueError:
            print("INGRESA UN VALOR NUMÉRICO VÁLIDO.\n")

def obtener_datos():
    nombre = input("Por favor introduce tu nombre:\n").strip()
    empresa = input("¿Dónde laboras?:\n").strip()

    print("\nYa casi terminamos, solo faltan unas cuantas informaciones más.\n")

    sueldo_bruto = pedir_float("Introduce tu sueldo bruto mensual (DOP):\n")

    horario_entrada = pedir_int("Horario de inicio (0-23, formato 24h):\n", 0, 23)
    horario_salida = pedir_int("Horario de salida (0-23, formato 24h):\n", 0, 23)

    # Cálculo de horas trabajadas (maneja turnos que cruzan medianoche)
    salida_ajustada = horario_salida
    if horario_salida < horario_entrada:
        salida_ajustada += 24

    horas_trabajadas = salida_ajustada - horario_entrada
    return nombre, empresa, sueldo_bruto, horas_trabajadas

def calculos_internos(sueldo_bruto: float):
    sfs = sueldo_bruto * SFS_RATE
    afp = sueldo_bruto * AFP_RATE

    sueldo_diario = sueldo_bruto / DIAS_LABORABLES_PROM
    sueldo_hora = sueldo_diario / HORAS_DIA

    sueldo_neto_sin_isr = sueldo_bruto - sfs - afp
    sueldo_anual_estimado = sueldo_neto_sin_isr * 12

    return {
        "sfs": sfs,
        "afp": afp,
        "sueldo_diario": sueldo_diario,
        "sueldo_hora": sueldo_hora,
        "sueldo_neto_sin_isr": sueldo_neto_sin_isr,
        "sueldo_anual_estimado": sueldo_anual_estimado,
    }

def obtener_horas_extras():
    he_diurnas = pedir_int("Ingresa la cantidad de horas extras diurnas:\n", 0)
    he_nocturnas = pedir_int(
        "Ingresa horas extras después de las 9 PM (o 0 si no trabajaste nocturnas):\n", 0
    )
    he_festivas = pedir_int(
        "Ingresa horas trabajadas después de las 12 PM del sábado o día festivo (o 0):\n", 0
    )
    return he_diurnas, he_nocturnas, he_festivas

def obtener_pago_total_extras(he_d, he_n, he_f, sueldo_hora: float):
    # Diurnas: 35% extra (pago total por hora extra = 1.35)
    pago_d = sueldo_hora * 1.35 * he_d

    # Nocturnas: 15% extra (pago total por hora extra = 1.15)
    pago_n = sueldo_hora * 1.15 * he_n

    # Festivas: doble (2.0)
    pago_f = sueldo_hora * 2.0 * he_f

    return pago_d + pago_n + pago_f

def obtener_isr_mensual(sueldo_anual: float) -> float:
    if 416220 < sueldo_anual <= 624329:
        isr = (sueldo_anual - 416220) * 0.15
    elif 624329 < sueldo_anual <= 867123:
        isr = 31216 + ((sueldo_anual - 624329) * 0.20)
    elif sueldo_anual > 867123:
        isr = 79776 + ((sueldo_anual - 867123) * 0.25)
    else:
        isr = 0

    return isr / 12

def costo_total_empleado(sueldo_bruto: float, sfs: float, afp: float, sueldo_neto_sin_isr: float):
    print("-" * 115)
    print("\nCosto total del empleado:\n")
    print(f"Seguro Familiar de Salud (SFS)     : DOP {round(sfs * 1.0709)}")
    print(f"Fondo de Pensiones (AFP)           : DOP {round(afp * 1.0710)}")
    print(f"Seguro de Riesgos Laborales (SRL)  : DOP {round(sueldo_neto_sin_isr * 0.0114)}")
    print(f"INFOTEP                            : DOP {round(sueldo_neto_sin_isr * 0.0100)}\n")

    total = (
        sueldo_neto_sin_isr
        + (sfs * 1.0709)
        + (afp * 1.0710)
        + (sueldo_neto_sin_isr * 0.0114)
        + (sueldo_neto_sin_isr * 0.0100)
    )

    print(f"Costo total                        : DOP {round(total)}\n")
    print("-" * 115)

def main():
    nombre, empresa, sueldo_bruto, horas_trabajadas = obtener_datos()

    datos = calculos_internos(sueldo_bruto)
    sueldo_hora = datos["sueldo_hora"]

    resp = input("\n¿Trabajaste horas extras en este mes? (S/N):\n").strip().lower()
    if resp == "s":
        he_d, he_n, he_f = obtener_horas_extras()
        pago_extras = obtener_pago_total_extras(he_d, he_n, he_f, sueldo_hora)
    else:
        he_d = he_n = he_f = 0
        pago_extras = 0

    sueldo_anual = datos["sueldo_anual_estimado"]
    isr = obtener_isr_mensual(sueldo_anual)

    sfs = datos["sfs"]
    afp = datos["afp"]
    sueldo_diario = datos["sueldo_diario"]
    sueldo_neto_sin_isr = datos["sueldo_neto_sin_isr"]

    total_desc = sfs + afp + isr
    neto_mensual = sueldo_bruto - total_desc

    print("-" * 115)
    print("Resultados obtenidos\n")
    print(
        f"El Sr./Sra. {nombre}, que labora en la empresa {empresa}, "
        f"devengando un sueldo bruto de DOP {round(sueldo_bruto)}, recibe:\n"
    )

    print(f"Sueldo bruto                                 : DOP {round(sueldo_bruto)}")
    print(f"Sueldo por Día                               : DOP {round(sueldo_diario)}")
    print(f"Sueldo por Hora                              : DOP {round(sueldo_hora)}")
    print(f"Horas de labor (según horario)               : {horas_trabajadas} horas")
    print(f"Pagos Totales Horas Extras                   : DOP {round(pago_extras)}\n")

    print("Descuentos\n")
    print(f"Seguro Familiar de Salud (SFS)               : DOP {round(sfs)}")
    print(f"Administradora de Fondo de Pensiones (AFP)   : DOP {round(afp)}")
    print(f"Impuesto Sobre la Renta (ISR)                : DOP {round(isr)}\n")

    print(f"Total de descuentos                          : DOP {round(total_desc)}\n")
    print(f"Sueldo Neto a recibir mensual                : DOP {round(neto_mensual)}")
    print(f"Sueldo Neto a recibir quincenal              : DOP {round(neto_mensual / 2)}\n")

    costo_total_empleado(sueldo_bruto, sfs, afp, sueldo_neto_sin_isr)

if __name__ == "__main__":
    main()
